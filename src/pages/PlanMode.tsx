import { useState } from "react";
import { CheckCircle2, Sparkles as SparklesIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export const PLAN_DETAILS = [
  {
    id: "basic",
    name: "Basic plan",
    price: "$10",
    numericPrice: 10,
    period: "per month",
    description: "Basic features for up to 10 users.",
    buttonText: "Get started",
    featuresTitle: "Everything in our free plan plus...",
    features: [
      "Access to basic features",
      "Basic reporting and analytics",
      "Up to 10 individual users",
      "20GB individual data each user",
      "Basic chat and email support"
    ]
  },
  {
    id: "business",
    name: "Business plan",
    price: "$20",
    numericPrice: 20,
    period: "per month",
    description: "Growing teams up to 20 users.",
    buttonText: "Get started",
    badge: "Popular",
    featuresTitle: "Everything in Basic plus...",
    features: [
      "Access to basic features",
      "Basic reporting and analytics",
      "Up to 10 individual users",
      "20GB individual data each user",
      "Basic chat and email support"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise plan",
    price: "$40",
    numericPrice: 40,
    period: "per month",
    description: "Advanced features + unlimited users.",
    buttonText: "Get started",
    featuresTitle: "Everything in Business plus...",
    features: [
      "Access to basic features",
      "Basic reporting and analytics",
      "Up to 10 individual users",
      "20GB individual data each user",
      "Basic chat and email support"
    ]
  }
];

export default function PlanMode() {
  const navigate = useNavigate();
  const [activePlanId, setActivePlanId] = useState("business");

  // Reorder plans so the active one is always in the center (index 1) on desktop
  const activePlan = PLAN_DETAILS.find(p => p.id === activePlanId)!;
  const otherPlans = PLAN_DETAILS.filter(p => p.id !== activePlanId);
  const displayPlans = [otherPlans[0], activePlan, otherPlans[1]];

  const handleSelectPlan = (planId: string) => {
    setActivePlanId(planId);
  };

  const handleCheckout = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    // Simulate setting chosen plan and go to checkout
    navigate(`/pagamento?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col items-center justify-center py-20 px-6 font-sans overflow-hidden">
      
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-indigo-600/[0.03] blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-20 relative z-10 font-sans">
        
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 
            className="text-4xl md:text-5xl lg:text-[4rem] font-black tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            A plan for every need
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto font-medium">
            Safely trade, earn, & borrow digital assets with top-tier security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch lg:px-10 perspective-1000 relative">
          <AnimatePresence>
            {displayPlans.map((plan, index) => {
              if (!plan) return null; // fallback
              const isSelected = plan.id === activePlanId;

              return (
                <motion.div 
                  layout
                  layoutId={`plan-card-${plan.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isSelected ? 1 : 0.6,
                    scale: isSelected ? 1.05 : 0.95,
                    zIndex: isSelected ? 40 : 10,
                    y: isSelected ? -20 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 110,
                    damping: 20,
                    mass: 0.8
                  }}
                  onClick={() => handleSelectPlan(plan.id)}
                  key={plan.id}
                  className={cn(
                    "group relative rounded-[2rem] flex flex-col overflow-hidden border bg-[#090910]/40 backdrop-blur-3xl cursor-pointer shadow-2xl",
                    isSelected 
                      ? "border-purple-500/40 ring-2 ring-purple-500/20 shadow-[0_0_80px_-20px_rgba(139,92,246,0.25)]" 
                      : "border-white/[0.06] hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "p-8 lg:p-10 space-y-6 relative transition-colors duration-500",
                    isSelected && "bg-gradient-to-br from-purple-900/40 to-transparent"
                  )}>
                    {isSelected && (
                      <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-30">
                        <SparklesIcon className="h-20 w-20 text-purple-400" />
                      </div>
                    )}

                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                        <p className={cn("text-sm font-bold tracking-wide uppercase", isSelected ? "text-purple-300" : "text-white/50")}>
                          {plan.name}
                        </p>
                        {plan.badge && (
                          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 relative z-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl lg:text-6xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-white/40 font-semibold">{plan.period}</span>
                      </div>
                      <p className="text-sm text-white/40 font-medium">{plan.description}</p>
                    </div>

                    <Button 
                      onClick={(e) => handleCheckout(e, plan.id)}
                      className={cn(
                        "w-full h-14 rounded-2xl text-[15px] font-bold transition-all duration-500 border relative z-10",
                        isSelected 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/40 border-0" 
                          : "bg-white/[0.03] text-white/80 hover:bg-white/10 hover:text-white border-white/10"
                      )}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>

                  <div className="px-8 lg:px-10">
                    <div className="h-px w-full bg-white/[0.06]" />
                  </div>

                  <div className="p-8 lg:p-10 flex-1 space-y-6 bg-white/[0.01]">
                    <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      FEATURES
                    </p>
                    <p className="text-xs font-semibold text-white/40 -mt-2">
                      {plan.featuresTitle}
                    </p>
                    <ul className="space-y-5">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3.5 group/feature">
                          <div className={cn(
                            "shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                            isSelected ? "border-purple-500/40 bg-purple-500/10" : "border-white/10"
                          )}>
                            <CheckCircle2 className={cn("h-3.5 w-3.5", isSelected ? "text-purple-400" : "text-white/30")} />
                          </div>
                          <span className={cn("text-[13px] font-medium tracking-tight", isSelected ? "text-white/80" : "text-white/50")}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isSelected && (
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/20 blur-[60px] pointer-events-none" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      <div className="fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      <div className="fixed inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />
      <div className="fixed inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </div>
  );
}
