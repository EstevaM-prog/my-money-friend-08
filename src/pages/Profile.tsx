import { useState } from "react";
import { Camera, Eye, EyeOff, Phone, Mail, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("João Silva");
  const [email, setEmail] = useState("joao@email.com");
  const [phone, setPhone] = useState("(11) 99999-0000");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  }

  function handleSave() {
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-primary">
          <UserIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
      </div>

      {/* Avatar Section */}
      <div className="bg-card rounded-xl p-8 card-shadow flex flex-col items-center gap-5">
        <div className="relative group">
          <Avatar className="h-28 w-28 text-3xl border-4 border-primary/20">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
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
          <h2 className="text-xl font-bold">{username}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-card rounded-xl p-6 card-shadow space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Informações Pessoais</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave} className="gradient-primary text-primary-foreground">
              Salvar
            </Button>
          )}
        </div>

        <Separator />

        <div className="grid gap-5">
          {/* Username */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <UserIcon className="h-4 w-4" /> Nome de usuário
            </Label>
            {isEditing ? (
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            ) : (
              <p className="text-sm font-medium pl-1">{username}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> Email
            </Label>
            {isEditing ? (
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            ) : (
              <p className="text-sm font-medium pl-1">{email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> Telefone
            </Label>
            {isEditing ? (
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            ) : (
              <p className="text-sm font-medium pl-1">{phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
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
