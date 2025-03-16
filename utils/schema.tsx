import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput', {
    id: serial('id').primaryKey(),
    formData: varchar('formData').notNull(),  // ✅ Removed length
    aiResponse: text('aiResponse'),
    templateSlug: varchar('templateSlug').notNull(),  // ✅ Removed length
    createdBy: varchar('createdBy').notNull(),  // ✅ Removed length
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow() // ✅ Corrected type
});

export const UserSubscription = pgTable("user_subscriptions", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(), // ✅ Ensure this field exists
    userName: varchar("userName", { length: 255 }),
    active: boolean("active").default(false),
    paymenId: varchar("paymenId", { length: 255 }),
    joinDate: timestamp("joinDate"),
});