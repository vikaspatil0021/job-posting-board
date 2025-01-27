import { Suspense } from 'react'


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <div>
                <Suspense>
                    {children}
                </Suspense>
            </div>
        </>
    )
}