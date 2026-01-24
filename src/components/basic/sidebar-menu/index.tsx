import React from 'react'
import './styles.css'
import { LogoWhite } from '@/constants/svgs'
import Link from "next/link";
import { usePathname } from 'next/navigation';

const SidebarMenu: React.FC = () => {
    const pathname = usePathname();
    console.log(pathname);

    const menuItems = [
        { href: '/cabildos', name: 'Cabildos' },
        { href: '/murals', name: 'Murales' },
        { href: '/darkroom', name: 'Dark Room' },
        { href: '/radio', name: 'Radio' }
        // { href: '/dashboard', name: 'Dashboard' },
        // { href: '/topics', name: 'Temas' },
        // { href: '/summary', name: 'Resumen' },
        // { href: '/unprocessed-statements', name: 'Declaraciones pendientes' },
        // { href: '/processed-statements', name: 'Declaraciones procesadas' },
        // { href: '/admin/topics', name: 'Temas predeterminados' },
    ]
    return (
        <div className='sidebar-menu'>
            <div style={{ paddingLeft: 8, paddingTop: 35 }}><LogoWhite /></div>
            <div style={{ height: 68 }} />
            <div className='sidebar-menu-items'>
                {menuItems.map((item, index) => (
                    <Link href={item.href} key={index}>
                        <div className={pathname.includes(item.href) ? 'sidebar-menu-item-active' : 'sidebar-menu-item'}>{item.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
export default SidebarMenu