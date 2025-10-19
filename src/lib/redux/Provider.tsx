'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './store'

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Le store est créé une seule fois et conservé via useRef
  const storeRef = useRef<AppStore>(makeStore())

  return <Provider store={storeRef.current}>{children}</Provider>
}
