import { SignIn } from "@clerk/react";
import AuthLayout from "../components/auth/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="w-full flex justify-center">

        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/"
          appearance={{
            variables: {

              colorPrimary: "#a855f7",

              colorBackground: "#0d1014",

              colorForeground: "#f9fafb",

              colorMutedForeground: "#9ca3af",

              colorInput: "#101318",

              colorInputForeground: "#f9fafb",

              colorBorder:
                "rgba(255,255,255,0.08)",

              colorRing: "#a855f7",

              colorDanger: "#ef4444",

              colorSuccess: "#22c55e",

              colorShadow:
                "rgba(0,0,0,0.4)",

              fontFamily:
                "Inter, ui-sans-serif, system-ui, sans-serif",

              borderRadius: "12px",
            },

            elements: {

              /* CARD */
              card: {
                width: "100%",
                maxWidth: "400px",

                background: "#0d1014",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius: "18px",

                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.40)",

                padding: "28px",

                margin: "0 auto",

                boxSizing: "border-box",
              },

              /* HEADER */
              headerTitle: {
                color: "#f9fafb",

                fontSize: "26px",

                fontWeight: "600",

                letterSpacing:
                  "-0.02em",

                lineHeight: "1.2",
              },

              headerSubtitle: {
                color: "#6b7280",

                fontSize: "13px",

                marginTop: "6px",

                lineHeight: "1.4",
              },

              /* SOCIAL LOGIN */
              socialButtons: {
                display: "grid",

                gridTemplateColumns:
                  "repeat(3, 1fr)",

                gap: "10px",

                marginTop: "20px",
              },

              socialButtonsBlockButton: {
                height: "46px",

                minHeight: "46px",

                background: "#101318",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius: "10px",

                color: "#e5e7eb",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                transition:
                  "all 0.2s ease",
              },

              /* SOCIAL ICONS */
              socialButtonsProviderIcon: {
                width: "22px",

                height: "22px",
              },

              socialButtonsBlockButtonText: {
                color: "#e5e7eb",

                fontSize: "13px",

                fontWeight: "500",
              },

              /* DIVIDER */

              dividerLine: {
                background:
                  "rgba(255,255,255,0.08)",
              },

              dividerText: {
                color: "#6b7280",

                fontSize: "12px",
              },

              /* FORM */

              form: {
                marginTop: "20px",
              },

              formFieldLabel: {
                color: "#d1d5db",

                fontSize: "13px",

                fontWeight: "500",

                marginBottom: "7px",
              },

              formFieldInput: {
                height: "46px",

                background: "#101318",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius: "10px",

                color: "#f9fafb",

                fontSize: "14px",

                boxSizing: "border-box",
              },

              formFieldInputShowPasswordButton: {
                color: "#6b7280",
              },

              formFieldInputShowPasswordButton__visible: {
                color: "#a855f7",
              },

              /* PRIMARY BUTTON */

              formButtonPrimary: {
                height: "46px",

                marginTop: "6px",

                background:
                  "linear-gradient(135deg, #9333ea, #a855f7)",

                border: "none",

                borderRadius: "10px",

                color: "#ffffff",

                fontSize: "14px",

                fontWeight: "600",

                boxShadow:
                  "0 8px 24px rgba(147,51,234,0.25)",
              },

              /* FOOTER */

              footer: {
                background: "#101318",

                borderTop:
                  "1px solid rgba(255,255,255,0.05)",

                marginTop: "4px",

                borderRadius:
                  "0 0 16px 16px",
              },

              footerActionText: {
                color: "#6b7280",

                fontSize: "13px",
              },

              footerActionLink: {
                color: "#c084fc",

                fontWeight: "600",
              },

              /* LINKS */

              formFieldAction: {
                color: "#a855f7",

                fontSize: "12px",
              },

              identityPreviewText: {
                color: "#d1d5db",
              },

              identityPreviewEditButton: {
                color: "#a855f7",
              },

              /* ALERT */

              alert: {
                background:
                  "rgba(239,68,68,0.08)",

                border:
                  "1px solid rgba(239,68,68,0.20)",

                color: "#fca5a5",
              },

              /* OTP */

              otpCodeFieldInput: {
                background: "#101318",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "#ffffff",

                height: "46px",

                borderRadius: "10px",
              },
            },
          }}
        />

      </div>
    </AuthLayout>
  );
}