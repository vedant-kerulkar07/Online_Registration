import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  contactNumber: z.string().min(10, "Contact number is required"),
  weightCategory: z.enum(["Below 60kg", "Below 75kg", "Above 75kg+"], {
    errorMap: () => ({ message: "Select a valid weight category" }),
  }),
  address: z.string().min(1, "Address is required"),
  hand: z.enum(["Right", "Left"], {
    errorMap: () => ({ message: "Select a valid hand" }),
  }),
});