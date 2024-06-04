export  default function Layout({children}: {children: React.ReactNode}) {
    return (
       <div className="flex h-screen justify-center items-center">
            {children}
        </div>
    );
}
