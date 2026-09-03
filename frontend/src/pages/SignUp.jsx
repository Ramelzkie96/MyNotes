import { SignUp } from "@clerk/react";
import AuthLayout from "../components/auth/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="w-full min-w-0">

        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
          appearance={{
            variables: {

              /* COLORS */

              colorPrimary: "#a855f7",

              colorBackground: "#0d1014",

              colorForeground: "#f9fafb",

              colorMutedForeground: "#9ca3af",

              colorInput: "#101318",

              colorInputForeground: "#f9fafb",

              colorBorder: "rgba(255,255,255,0.08)",

              colorRing: "#a855f7",

              colorDanger: "#ef4444",

              colorSuccess: "#22c55e",

              colorShadow: "rgba(0,0,0,0.4)",

              /* TYPOGRAPHY */
              fontFamily:
                "Inter, ui-sans-serif, system-ui, sans-serif",

              borderRadius: "12px",
            },

            elements: {

              /* CARD */
              card: {
                width: "100%",
                maxWidth: "390px",
                boxSizing: "border-box",

                background: "#0d1014",

                border:
                  "1px solid rgba(255,255,255,0.07)",

                borderRadius: "20px",

                boxShadow:
                  "0 25px 70px rgba(0,0,0,0.45)",

                padding: "28px",
              },


              /* HEADER */
              headerTitle: {
                color: "#f9fafb",

                fontSize: "26px",

                fontWeight: "600",

                letterSpacing: "-0.02em",
              },

              headerSubtitle: {
                color: "#6b7280",

                fontSize: "13px",

                marginTop: "6px",
              },


              /* SOCIAL LOGIN */
              socialButtons: {
                display: "grid",

                gridTemplateColumns:
                  "repeat(3, 1fr)",

                gap: "10px",
              },

              socialButtonsBlockButton: {
                height: "46px",

                background: "#101318",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius: "10px",

                color: "#e5e7eb",

                transition:
                  "all 0.2s ease",
              },

              socialButtonsBlockButtonText: {
                color: "#e5e7eb",

                fontSize: "13px",

                fontWeight: "500",
              },


              /* DIVIDER */
              dividerLine: {
                background:
                  "rgba(255,255,255,0.07)",
              },

              dividerText: {
                color: "#6b7280",

                fontSize: "12px",
              },


              /* FORM */
              formFieldLabel: {
                color: "#d1d5db",

                fontSize: "13px",

                fontWeight: "500",

                marginBottom: "7px",
              },

              formFieldInput: {
                height: "48px",

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
                height: "48px",

                marginTop: "6px",

                background:
                  "linear-gradient(135deg, #9333ea, #a855f7)",

                border: "none",

                borderRadius: "10px",

                color: "#ffffff",

                fontSize: "14px",

                fontWeight: "600",

                boxShadow:
                  "0 10px 30px rgba(147,51,234,0.25)",
              },


              /* FOOTER */
              footer: {
                background: "#101318",

                borderTop:
                  "1px solid rgba(255,255,255,0.05)",
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
                  "1px solid rgba(239,68,68,0.2)",

                color: "#fca5a5",
              },

              
              /* OTP */
              otpCodeFieldInput: {
                background: "#101318",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "#ffffff",

                boxSizing: "border-box",
              },
            },
          }}
        />

      </div>
    </AuthLayout>
  );
}