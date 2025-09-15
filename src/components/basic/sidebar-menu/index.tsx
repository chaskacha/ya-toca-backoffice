import React from 'react'
import './styles.css'
import { LogoWhite } from '@/constants/svgs'
import Link from "next/link";
import { usePathname } from 'next/navigation';

const SidebarMenu: React.FC = () => {
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', name: 'Dashboard' },
        { href: '/topics', name: 'Temas' },
        { href: '/summary', name: 'Resumen' },
        { href: '/chat', name: 'Chat' },
        { href: '/unprocessed-statements', name: 'Declaraciones pendientes' },
        { href: '/processed-statements', name: 'Declaraciones procesadas' },
        { href: '/admin/topics', name: 'Temas predeterminados' },
    ]
    return (
        <div className='sidebar-menu'>
            <div style={{ paddingLeft: 32, paddingTop: 35 }}><LogoWhite /></div>
            <div style={{ height: 68 }} />
            <div className='sidebar-menu-items'>
                {menuItems.map((item, index) => (
                    <Link href={item.href} key={index}>
                        <div className={item.href === pathname ? 'sidebar-menu-item-active' : 'sidebar-menu-item'}>{item.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
export default SidebarMenu