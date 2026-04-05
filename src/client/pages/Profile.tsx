import { useState } from "react";
import { Camera, Eye, EyeOff, Phone, Mail, User as UserIcon, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/client/hooks/use-toast";
import { useLocalStorage } from "@/client/hooks/use-local-storage";
import { getSession } from "@/client/lib/auth";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/client/lib/utils";

interface ProfileData {
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ProfilePage() {
  const { toast } = useToast();
  const session = getSession();

  const [profile, setProfile] = useLocalStorage<ProfileData>("financaspro_profile", {
    username: session?.name ?? "Usuário",
    email: session?.email ?? "usuario@email.com",
    phone: "(11) 99999-0000",
    avatarUrl: "",
  });

  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);

  const initials = profile.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setProfile((prev) => ({ ...prev, avatarUrl: dataUrl }));
        setEditData((prev) => ({ ...prev, avatarUrl: dataUrl }));
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi alterada com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  }

  function startEditing() {
    setEditData(profile);
    setIsEditing(true);
  }

  function handleSave() {
    setProfile(editData);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  }

  return (
    <div className="w-full min-h-screen pb-20 sm:pb-10 font-sans tracking-tight bg-[#030306] relative overflow-hidden text-white/90">

      {/* ═══ Ambient Background ═══ */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-500/[0.06] rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-violet-500/[0.06] rounded-full blur-[150px] pointer-events-none z-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[800px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
              className="h-16 w-16 bg-gradient-to-br from-blue-500/25 to-violet-600/25 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative shrink-0"
            >
              <UserIcon className="h-8 w-8 text-blue-400" />
              <div className="absolute inset-0 rounded-2xl bg-blue-400/10 animate-pulse" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
                Meu Perfil
              </h1>
              <p className="text-sm text-white/40 font-medium mt-1">Gerencie suas informações e preferências pessoais</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={itemVariants} className="relative rounded-[32px] overflow-hidden group">
          <div className="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-b from-blue-500/30 via-transparent to-violet-500/20 z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-[1px] rounded-[31px] bg-[#080810]" />
          </div>

          <div className="relative bg-[#080810]/95 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">

            {/* Avatar Column */}
            <div className="flex flex-col items-center gap-6 shrink-0 relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none" />

              <motion.div whileHover={{ scale: 1.05 }} className="relative group/avatar">
                <Avatar className="h-32 w-32 border-4 border-[#080810] shadow-[0_0_0_2px_rgba(59,130,246,0.5),0_0_40px_rgba(59,130,246,0.3)] transition-all duration-500">
                  <AvatarImage src={profile.avatarUrl} alt={profile.username} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-violet-600/30 text-blue-100 text-3xl font-black">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.5)] transform hover:scale-110 transition-all border-2 border-[#080810]"
                >
                  <Camera className="h-5 w-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </motion.div>

              <div className="text-center md:hidden">
                <h2 className="text-2xl font-black text-white">{profile.username}</h2>
                <p className="text-sm text-white/50">{profile.email}</p>
              </div>
            </div>

            {/* Info Column */}
            <div className="flex-1 w-full space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <h3 className="text-xl font-black text-white px-1">Dados Pessoais</h3>

                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Button
                        variant="ghost"
                        onClick={startEditing}
                        className="bg-white/5 hover:bg-white/10 text-white/80 rounded-xl font-bold border border-white/10"
                      >
                        Editar Perfil
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="bg-white/5 hover:bg-rose-500/20 text-white/80 hover:text-rose-400 rounded-xl font-bold border border-white/10 transition-colors"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-xl font-bold flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Salvar
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2.5">
                  <Label className="flex items-center gap-2 text-white/40 text-[11px] uppercase tracking-widest font-black">
                    <UserIcon className="h-3.5 w-3.5" /> Nome completo
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="h-12 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white rounded-xl"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white/90 font-semibold">
                      {profile.username}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2.5">
                  <Label className="flex items-center gap-2 text-white/40 text-[11px] uppercase tracking-widest font-black">
                    <Mail className="h-3.5 w-3.5" /> Email principal
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="h-12 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white rounded-xl"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white/90 font-semibold">
                      {profile.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2.5">
                  <Label className="flex items-center gap-2 text-white/40 text-[11px] uppercase tracking-widest font-black">
                    <Phone className="h-3.5 w-3.5" /> Telefone
                  </Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="h-12 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white rounded-xl"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-white/90 font-semibold">
                      {profile.phone}
                    </div>
                  )}
                </div>

                {/* Password Placeholder */}
                <div className="space-y-2.5">
                  <Label className="flex items-center gap-2 text-white/40 text-[11px] uppercase tracking-widest font-black">
                    <Eye className="h-3.5 w-3.5" /> Senha (Visualização)
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      readOnly={!isEditing}
                      onChange={(e) => isEditing && setPassword(e.target.value)}
                      className={cn(
                        "h-12 px-4 rounded-xl font-semibold",
                        isEditing
                          ? "bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white"
                          : "bg-white/[0.02] border-white/[0.04] text-white/90 pointer-events-none"
                      )}
                    />
                    <button
                      type="button"
                      className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 transition-colors",
                        isEditing ? "text-white/40 hover:text-white" : "text-white/20 hover:text-white/50 pointer-events-auto"
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
