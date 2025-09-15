"use client";
import React, { useContext, useEffect, useState } from "react";
import FormSection from "../_components/FormSection";
import OutputSection from "../_components/OutputSection";
import ImagePromptForm from "../_components/ImagePromptForm";
import MultiImageComposeForm from "../_components/MultiImageComposeForm";
import Templates from "@/app/(data)/Templates";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { chatSession } from "@/utils/AiModal";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useClerk, useUser } from "@clerk/nextjs";
import moment from "moment";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { useRouter } from "next/navigation";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

const CreateNewContent = (props: PROPS) => {
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug == props.params["template-slug"]
  );

  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const { userSubscription } = useContext(UserSubscriptionContext);
  const { setUpdateCreditUsage } = useContext(UpdateCreditUsageContext);

  const [freeGenUsed, setFreeGenUsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const flag = typeof window !== "undefined" ? window.localStorage.getItem("freeGenUsed") : null;
      setFreeGenUsed(flag === "1");
    } catch {
      // ignore storage errors
    }
  }, []);

  /**
   * Generate basic prompt and display in RTE
   */
  const GeneratePrompt = (prompt: string) => {
    setAiOutput(prompt);
    setImages([]);
  };

  /**
   * Refine prompt using LLM and display in RTE
   */
  const RefinePrompt = async (userInputs: any): Promise<string> => {
    if (totalUsage >= 10000 && !userSubscription) {
      alert("You have reached the maximum usage limit. Please upgrade your plan.");
      return "";
    }

    setRefining(true);
    try {
      // Create a prompt for the LLM to refine the user's inputs into a polished image prompt
      const refinementPrompt = `You are an expert prompt engineer for AI image generation. Based on the user's inputs, create a detailed, professional image generation prompt that will produce high-quality results.

User inputs:
- Main idea: ${userInputs.idea}
- Style: ${userInputs.style}
- Mood: ${userInputs.mood}
- Artist inspiration: ${userInputs.artist || 'none'}
- Camera lens: ${userInputs.lens}
- Aperture: ${userInputs.aperture}
- Lighting: ${userInputs.lightingStyle}
- Color grading: ${userInputs.colorGrading}
- Film texture: ${userInputs.filmTexture}
- Avoid: ${userInputs.negSelected.join(', ')}
- Custom negatives: ${userInputs.negCustom || 'none'}
- Detail level: ${userInputs.mode}

Create a single, coherent, professional image generation prompt that incorporates these elements naturally. The prompt should be:
- 1-2 sentences maximum
- Professional and detailed
- Include technical photography terms naturally
- Include the negative prompts at the end with "Negative:" prefix

Return only the refined prompt, nothing else.`;

      const result = await chatSession.sendMessage(refinementPrompt);
      const refinedPrompt = result?.response?.text() || "";
      
      // Display the refined prompt in the RTE
      setAiOutput(refinedPrompt);
      setImages([]);
      
      return refinedPrompt;
    } catch (error) {
      console.error("Prompt refinement error:", error);
      alert("Failed to refine prompt. Please try again.");
      return "";
    } finally {
      setRefining(false);
      setUpdateCreditUsage(Date.now());
    }
  };

  /**
   * Generate AI content
   */
  const GenerateAIContent = async (formData: any) => {
    // Guest gating: allow exactly one successful generation when not signed in
    if (!isSignedIn && freeGenUsed) {
      try {
        openSignIn?.({ afterSignInUrl: "/dashboard" });
      } catch {
        router.push("/sign-in");
      }
      return;
    }

    if (totalUsage >= 10000 && !userSubscription) {
      alert(
        "You have reached the maximum usage limit of 10000 requests per month. Please upgrade your plan to continue using the service"
      );
      setTimeout(() => {
        router.push("/dashboard/billing");
      }, 1000);
      return;
    }

    setLoading(true);

    try {
      if (selectedTemplate?.slug === "nano-banana-image-generator") {
        const resp = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            prompt: formData?.prompt,
            numImages: formData?.numImages,
            size: formData?.size,
          }),
        });

        const contentType = resp.headers.get("content-type") || "";
        let data: any = null;
        if (contentType.includes("application/json")) {
          data = await resp.json();
        } else {
          const text = await resp.text();
          throw new Error(text || `HTTP ${resp.status}`);
        }
        if (!resp.ok) {
          throw new Error(data?.error || data?.details || `HTTP ${resp.status}`);
        }

        const imgs: string[] = data?.images || [];
        setImages(imgs);
        // Save URLs list as newline-separated for history
        const toSave = imgs.join("\n");
        if (isSignedIn) {
          await SaveInDb(formData, selectedTemplate?.slug, toSave || JSON.stringify(data));
        }
      } else if (selectedTemplate?.slug === "nano-banana-multi-image-composer") {
        // Expect a special payload from the multi-image form: { prompt, imagesData, numImages, size }
        const resp = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            prompt: formData?.prompt,
            numImages: formData?.numImages,
            size: formData?.size,
            imagesData: formData?.imagesData || [],
          }),
        });

        const contentType = resp.headers.get("content-type") || "";
        let data: any = null;
        if (contentType.includes("application/json")) {
          data = await resp.json();
        } else {
          const text = await resp.text();
          throw new Error(text || `HTTP ${resp.status}`);
        }
        if (!resp.ok) {
          throw new Error(data?.error || data?.details || `HTTP ${resp.status}`);
        }

        const imgs: string[] = data?.images || [];
        setImages(imgs);
        const toSave = imgs.join("\n");
        if (isSignedIn) {
          await SaveInDb(formData, selectedTemplate?.slug, toSave || JSON.stringify(data));
        }
      } else {
        const SelectedPrompt = selectedTemplate?.aiPrompt;
        const FinalAiPrompt = JSON.stringify(formData) + "," + SelectedPrompt;
        const result = await chatSession.sendMessage(FinalAiPrompt);

        if (result?.response?.text) {
          const outputText = result.response.text();
          setAiOutput(outputText);
          setImages([]);
          if (isSignedIn) {
            await SaveInDb(formData, selectedTemplate?.slug, outputText);
          }
        }
      }

      // After a successful generation as guest, mark free use and prompt sign-in
      if (!isSignedIn && !freeGenUsed) {
        try {
          window.localStorage.setItem("freeGenUsed", "1");
          setFreeGenUsed(true);
        } catch {
          // ignore storage errors
        }
        try {
          openSignIn?.({ afterSignInUrl: "/dashboard" });
        } catch {
          router.push("/sign-in");
        }
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Something went wrong");
    }

    setLoading(false);
    setUpdateCreditUsage(Date.now());
  };

  /**
   * Save AI output to the database
   */
  const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error("Error: User email is undefined");
      return;
    }

    try {
      const result = await db.insert(AIOutput).values({
        formData: JSON.stringify(formData), // Ensure it's a string
        templateSlug: slug,
        aiResponse: aiResp,
        createdBy: user.primaryEmailAddress.emailAddress, // Ensured not undefined
        createdAt: moment().toDate(), // Use correct format
      });

      console.log("Data saved successfully:", result);
    } catch (error) {
      console.error("Database insertion error:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{backgroundColor: '#EDF2F4'}}>
      <div className="mb-6">
        <Link href={"/dashboard"}>
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* FormSection or ImagePromptForm */}
        {selectedTemplate?.slug === 'image-prompt-generator' ? (
          <div className="p-6 bg-white shadow-lg border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <img src={selectedTemplate?.icon} alt='icon' width={70} height={70} />
              <div>
                <h2 className='font-bold text-2xl text-gray-900'>{selectedTemplate?.name}</h2>
                <p className='text-gray-500 text-sm'>{selectedTemplate?.desc}</p>
              </div>
            </div>
            <ImagePromptForm
              refining={refining}
              onRefinePrompt={RefinePrompt}
              onGeneratePrompt={GeneratePrompt}
            />
          </div>
        ) : selectedTemplate?.slug === 'nano-banana-multi-image-composer' ? (
          <div className="p-6 bg-white shadow-lg border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <img src={selectedTemplate?.icon} alt='icon' width={70} height={70} />
              <div>
                <h2 className='font-bold text-2xl text-gray-900'>{selectedTemplate?.name}</h2>
                <p className='text-gray-500 text-sm'>{selectedTemplate?.desc}</p>
              </div>
            </div>
            <MultiImageComposeForm
              loading={loading}
              onSubmit={(payload) => GenerateAIContent(payload)}
            />
          </div>
        ) : (
          <FormSection selectedTemplate={selectedTemplate} userFormInput={(v: any) => GenerateAIContent(v)} loading={loading} />
        )}

        {/* OutputSection */}
        <div className="col-span-2">
          <OutputSection
            aiOutput={aiOutput}
            images={images}
            loading={loading}
            forceImageUI={selectedTemplate?.slug === "nano-banana-image-composer" || selectedTemplate?.slug === "nano-banana-image-generator" || selectedTemplate?.slug === 'nano-banana-multi-image-composer'}
            emptyStateMessage={selectedTemplate?.slug === 'nano-banana-multi-image-composer' ? 'No image generated for now. Please add images and generate images.' : undefined}
            onRefine={async (newPrompt: string) => {
              // Re-run generation with refined prompt, keep same settings if present
              await GenerateAIContent({
                ...((selectedTemplate?.form || []).reduce((acc: any, f: any) => (acc[f.name] = acc[f.name] || undefined, acc), {})),
                prompt: newPrompt,
                numImages:  (typeof (window as any) !== 'undefined' ? undefined : undefined),
                size: undefined,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNewContent;
