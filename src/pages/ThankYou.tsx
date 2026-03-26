import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const ThankYou = () => {
  const primaryColor = "#0a2a1b";
  const goldColor = "#c9a64a";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: primaryColor,
        color: "#ffffff",
        fontFamily: "var(--font-sans)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center p-8 rounded-2xl border"
        style={{ borderColor: "rgba(201, 166, 74, 0.2)" }}
      >
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} color={goldColor} />
        </div>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: goldColor }}
        >
          Obrigado!
        </h1>
        <p className="text-lg opacity-90 mb-8 leading-relaxed">
          Seu pagamento foi processado com sucesso. Em breve, nossa equipe entrará em contato para dar início ao seu diagnóstico.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 rounded-full font-bold transition-all"
          style={{
            backgroundColor: goldColor,
            color: primaryColor,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          VOLTAR PARA O INÍCIO
        </a>
      </motion.div>
    </div>
  );
};

export default ThankYou;
