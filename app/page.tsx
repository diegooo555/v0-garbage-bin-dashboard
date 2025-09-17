"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Bell, Settings, User, Zap, TrendingUp, AlertTriangle, CheckCircle, Wifi } from "lucide-react"

interface Notification {
  id: string
  message: string
  timestamp: Date
  type: "full" | "warning" | "info" | "success"
  priority: "high" | "medium" | "low"
}

export default function WasteContainerMonitor() {
  const [fillPercentage, setFillPercentage] = useState(75)
  const [isConnected, setIsConnected] = useState(true)
  const [lastEmptied, setLastEmptied] = useState(new Date("2024-01-14T08:30:00"))
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      message: "Contenedor lleno - Requiere vaciado inmediato",
      timestamp: new Date("2024-01-15T14:30:00"),
      type: "full",
      priority: "high",
    },
    {
      id: "2",
      message: "Contenedor al 90% de capacidad",
      timestamp: new Date("2024-01-15T12:15:00"),
      type: "warning",
      priority: "medium",
    },
    {
      id: "3",
      message: "Contenedor vaciado exitosamente",
      timestamp: new Date("2024-01-15T08:45:00"),
      type: "success",
      priority: "low",
    },
    {
      id: "4",
      message: "Sensor de temperatura funcionando correctamente",
      timestamp: new Date("2024-01-14T16:20:00"),
      type: "info",
      priority: "low",
    },
    {
      id: "5",
      message: "Mantenimiento programado completado",
      timestamp: new Date("2024-01-14T13:10:00"),
      type: "success",
      priority: "medium",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setFillPercentage((prev) => {
        // Simulate more realistic filling pattern
        const timeOfDay = new Date().getHours()
        const isBusinessHours = timeOfDay >= 8 && timeOfDay <= 18
        const fillRate = isBusinessHours ? Math.random() * 2 : Math.random() * 0.5

        const newValue = prev + fillRate
        const clampedValue = Math.max(0, Math.min(100, newValue))

        // Add new notification when reaching thresholds
        if (prev < 90 && clampedValue >= 90) {
          const newNotification: Notification = {
            id: Date.now().toString(),
            message: "¡Atención! Contenedor al 90% - Programar vaciado pronto",
            timestamp: new Date(),
            type: "warning",
            priority: "high",
          }
          setNotifications((current) => [newNotification, ...current.slice(0, 9)])
        }

        return clampedValue
      })

      // Simulate occasional connection issues
      setIsConnected(Math.random() > 0.05)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (percentage: number) => {
    if (percentage >= 95) return "text-destructive animate-pulse"
    if (percentage >= 90) return "text-chart-4"
    if (percentage >= 70) return "text-chart-3"
    if (percentage >= 50) return "text-chart-2"
    return "text-primary"
  }

  const getStatusText = (percentage: number) => {
    if (percentage >= 95) return "Crítico - Vaciar Ahora"
    if (percentage >= 90) return "Muy Lleno"
    if (percentage >= 70) return "Advertencia"
    if (percentage >= 50) return "Medio Lleno"
    return "Normal"
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "full":
        return "destructive"
      case "warning":
        return "secondary"
      case "success":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "medium":
        return <TrendingUp className="h-4 w-4 text-chart-3" />
      default:
        return <CheckCircle className="h-4 w-4 text-chart-2" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleEmptyContainer = () => {
    setFillPercentage(0)
    setLastEmptied(new Date())
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: "Contenedor vaciado manualmente desde el dashboard",
      timestamp: new Date(),
      type: "success",
      priority: "medium",
    }
    setNotifications((current) => [newNotification, ...current.slice(0, 9)])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="glass-card border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Trash2 className="h-10 w-10 text-primary animate-float" />
                <div className="absolute -top-1 -right-1">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? "bg-chart-2" : "bg-destructive"} animate-pulse`}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Smart Waste Monitor
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  {isConnected ? "Conectado" : "Desconectado"} • Contenedor WC-001
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => n.priority === "high").length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="glass-card border-border/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary" />
                  Estado del Contenedor
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Enhanced circular progress */}
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative w-64 h-64">
                      {/* Outer glow ring */}
                      <div
                        className={`absolute inset-0 rounded-full ${fillPercentage >= 90 ? "animate-pulse-glow" : ""}`}
                      />

                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle with gradient */}
                        <defs>
                          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop
                              offset="0%"
                              stopColor={
                                fillPercentage >= 90 ? "#ef4444" : fillPercentage >= 70 ? "#f59e0b" : "#10b981"
                              }
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                fillPercentage >= 90 ? "#dc2626" : fillPercentage >= 70 ? "#d97706" : "#059669"
                              }
                            />
                          </linearGradient>
                        </defs>

                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="url(#bgGradient)"
                          strokeWidth="6"
                          fill="none"
                          className="text-muted-foreground"
                        />

                        {/* Animated progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="url(#fillGradient)"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - fillPercentage / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>

                      {/* Center content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div
                            className={`text-5xl font-bold ${getStatusColor(fillPercentage)} transition-colors duration-500`}
                          >
                            {Math.round(fillPercentage)}%
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Llenado</div>
                          <Badge
                            variant={
                              fillPercentage >= 90 ? "destructive" : fillPercentage >= 70 ? "secondary" : "outline"
                            }
                            className="mt-3 px-3 py-1"
                          >
                            {getStatusText(fillPercentage)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced info panel */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round((100 - fillPercentage) * 1.2)}m
                        </div>
                        <div className="text-xs text-muted-foreground">Capacidad Restante</div>
                      </div>
                      <div className="glass-card p-4 text-center">
                        <div className="text-2xl font-bold text-chart-2">
                          {Math.floor((Date.now() - lastEmptied.getTime()) / (1000 * 60 * 60 * 24))}d
                        </div>
                        <div className="text-xs text-muted-foreground">Último Vaciado</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Última actualización:</span>
                        <span className="font-medium">{new Date().toLocaleTimeString("es-ES")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Peso</span>
                        <span className="font-medium">45 kg</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleEmptyContainer}
                      className="w-full transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 text-foreground border-2 border-primary/20 hover:border-primary/40"
                      style={{
                        backgroundColor: "#f8fafc",
                        color: "#1e293b",
                      }}
                      disabled={fillPercentage < 10}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Marcar como Vaciado
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="glass-card border-border/50 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="h-5 w-5 text-primary" />
                  Notificaciones
                  <Badge variant="secondary" className="ml-auto">
                    {notifications.filter((n) => n.priority === "high").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className="glass-card p-4 hover:bg-muted/20 transition-all duration-300 border-l-4"
                      style={{
                        borderLeftColor:
                          notification.type === "full"
                            ? "#ef4444"
                            : notification.type === "warning"
                              ? "#f59e0b"
                              : notification.type === "success"
                                ? "#10b981"
                                : "#6b7280",
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {getPriorityIcon(notification.priority)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                              {notification.type === "full"
                                ? "Lleno"
                                : notification.type === "warning"
                                  ? "Advertencia"
                                  : notification.type === "success"
                                    ? "Éxito"
                                    : "Info"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(notification.timestamp)}</span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
