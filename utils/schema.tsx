import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput', {
    id: serial('id').primaryKey(),
    formData: varchar('formData').notNull(),  // ✅ Removed length
    aiResponse: text('aiResponse'),
    templateSlug: varchar('templateSlug').notNull(),  // ✅ Removed length
    createdBy: varchar('createdBy').notNull(),  // ✅ Removed length
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow() // ✅ Corrected type
});

export const UserSubscription = pgTable('userSubscription', {
    id: serial('id').primaryKey(),
    email: varchar('email').notNull(), // ✅ Removed length
    userName: varchar('userName'),
    active: boolean('active').notNull().default(false),  // ✅ Ensures `active` is not null
    paymenId: varchar('paymentId'),
    joinDate: timestamp('joinDate', { withTimezone: true }) // ✅ Corrected type
});