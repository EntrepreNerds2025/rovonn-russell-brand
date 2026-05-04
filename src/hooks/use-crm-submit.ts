import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type FormType = "strategy_call" | "speaking_inquiry" | "contact_form" | "tool_signup";

interface BasePayload {
  form_type: FormType;
  email: string;
  name?: string;
  organization?: string;
  org?: string;
  message?: string;
  interest?: string;
  interest_type?: string;
  event_name?: string;
  event?: string;
  event_date?: string;
  tool_name?: string;
}

async function submitWebsiteForm(payload: BasePayload) {
  const { data, error } = await supabase.functions.invoke("submit-website-form", {
    body: payload,
  });

  if (error) throw new Error(error.message || "Submission failed");
  if (data?.error) throw new Error(data.error);
  return data;
}

export function useStrategyCallSubmit() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; organization?: string; message?: string }) =>
      submitWebsiteForm({ ...data, form_type: "strategy_call" }),
    onSuccess: () => toast.success("Strategy call request submitted! We'll be in touch soon."),
    onError: (err: Error) => toast.error(err.message || "Something went wrong. Please try again."),
  });
}

export function useSpeakingInquirySubmit() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; org?: string; event?: string; event_date?: string; message?: string }) =>
      submitWebsiteForm({ ...data, form_type: "speaking_inquiry", event_name: data.event }),
    onSuccess: () => toast.success("Speaking inquiry submitted! We'll review and respond shortly."),
    onError: (err: Error) => toast.error(err.message || "Something went wrong. Please try again."),
  });
}

export function useContactFormSubmit() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; org?: string; interest?: string; message?: string }) =>
      submitWebsiteForm({ ...data, form_type: "contact_form", organization: data.org }),
    onSuccess: () => toast.success("Message sent! We'll get back to you soon."),
    onError: (err: Error) => toast.error(err.message || "Something went wrong. Please try again."),
  });
}

export function useToolSignupSubmit() {
  return useMutation({
    mutationFn: (data: { email: string; tool_name: string; organization?: string }) =>
      submitWebsiteForm({ ...data, form_type: "tool_signup", name: data.email.split("@")[0] }),
    onSuccess: () => toast.success("You're in! Check your email for next steps."),
    onError: (err: Error) => toast.error(err.message || "Something went wrong. Please try again."),
  });
}

export function useStarterKitSubmit() {
  return useMutation({
    mutationFn: (data: { firstName: string; email: string; audience: string }) =>
      submitWebsiteForm({
        form_type: "tool_signup",
        tool_name: "visibility_starter_kit",
        name: data.firstName,
        email: data.email,
        interest: data.audience,
        message: `Visibility Starter Kit signup. Audience: ${data.audience}`,
      }),
    onSuccess: () => toast.success("Your kit is ready. Download below."),
    onError: (err: Error) => toast.error(err.message || "Something went wrong. Please try again."),
  });
}
