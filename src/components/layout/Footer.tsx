'use client'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-text-secondary">
                        © {currentYear} Super Aguilares. Todos los derechos reservados. Diseñado por DaniR-Sirius
                    </p>
                    <p className="text-sm text-text-secondary">
                        Diseñado por <span className="font-semibold text-text-main">DaniR</span> - <span className="font-semibold text-text-main">SiriuS</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
