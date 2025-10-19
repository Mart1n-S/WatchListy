'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser, clearUser } from "@/lib/redux/slices/userSlice"

export default function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(setUser({
        id: session.user.id ?? null,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        role: session.user.role ?? null,
        createdAt: session.user.createdAt ?? null,
        isAuthenticated: true,
      }))
    } else if (status === "unauthenticated") {
      dispatch(clearUser())
    }
  }, [session, status, dispatch])

  return <>{children}</>
}
