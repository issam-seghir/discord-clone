import React from 'react'
import { Menu } from 'lucide-react'
import { Sheet ,SheetContent,SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SideBar } from '@/components/layout/side-bar'
import { ServerSideBar } from '@/components/layout/server-side-bar'
export  function MobileToggle({serverId}: {serverId: string}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className='p-0 flex gap-0'>
        <div className='w-[72px]'>
          <SideBar />
        </div>
        <ServerSideBar serverId={serverId} />
      </SheetContent>
    </Sheet>
  )
}
