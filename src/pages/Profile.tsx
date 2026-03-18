import { useState } from "react";
import { Camera, Eye, EyeOff, Phone, Mail, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getSession } from "@/lib/auth";

interface ProfileData {
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

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
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-primary">
          <UserIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Meu Perfil</h1>
      </div>

      {/* Avatar Section */}
      <div className="bg-card rounded-xl p-6 sm:p-8 card-shadow flex flex-col items-center gap-4 sm:gap-5">
        <div className="relative group">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 text-2xl sm:text-3xl border-4 border-primary/20">
            <AvatarImage src={profile.avatarUrl} alt={profile.username} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl sm:text-3xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground cursor-pointer shadow-lg hover:scale-110 transition-transform"
          >
            <Camera className="h-4 w-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold">{profile.username}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-card rounded-xl p-5 sm:p-6 card-shadow space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">Informações Pessoais</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={startEditing}>
              Editar
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave} className="gradient-primary text-primary-foreground">
              Salvar
            </Button>
          )}
        </div>

        <Separator />

        <div className="grid gap-4 sm:gap-5">
          {/* Username */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
              <UserIcon className="h-4 w-4" /> Nome de usuário
            </Label>
            {isEditing ? (
              <Input value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} />
            ) : (
              <p className="text-sm font-medium pl-1">{profile.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
              <Mail className="h-4 w-4" /> Email
            </Label>
            {isEditing ? (
              <Input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
            ) : (
              <p className="text-sm font-medium pl-1">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
              <Phone className="h-4 w-4" /> Telefone
            </Label>
            {isEditing ? (
              <Input type="tel" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
            ) : (
              <p className="text-sm font-medium pl-1">{profile.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
              <Eye className="h-4 w-4" /> Senha
            </Label>
            {isEditing ? (
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            ) : (
              <p className="text-sm font-medium pl-1">••••••••</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
