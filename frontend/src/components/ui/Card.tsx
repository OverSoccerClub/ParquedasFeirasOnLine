import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-surface rounded-xl shadow-card", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn("p-6 pb-3", className)} {...props} />
}

function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3 className={cn("text-lg font-semibold text-[#1A1A1A]", className)} {...props} />
  )
}

function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pt-0 flex items-center", className)} {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
