import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { currentUser , auth} from "@clerk/nextjs/server"
import { prisma } from "@/lib/prismadb"


export async function getUserData() {
  const user = await currentUser()
  if (!user) return null
  const userData = await prisma.profile.findUnique({
    where: {
      id: user.id
    }
  })
  return userData
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
