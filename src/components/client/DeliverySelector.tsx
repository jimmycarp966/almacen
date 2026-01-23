'use client'

interface DeliverySelectorProps {
    tipoEntrega: 'domicilio' | 'retiro'
    onChangeTipoEntrega: (tipo: 'domicilio' | 'retiro') => void
    costoEnvio: number
}

export function DeliverySelector({ tipoEntrega, onChangeTipoEntrega, costoEnvio }: DeliverySelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-main">¿Cómo querés recibir tu pedido?</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Opción Domicilio */}
                <button
                    type="button"
                    onClick={() => onChangeTipoEntrega('domicilio')}
                    className={`relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border-2 transition-all ${tipoEntrega === 'domicilio'
                            ? 'border-primary bg-red-50 shadow-lg scale-[1.02]'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                        }`}
                >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${tipoEntrega === 'domicilio' ? 'bg-primary' : 'bg-gray-100'
                        }`}>
                        <span className={`material-symbols-outlined text-2xl sm:text-3xl ${tipoEntrega === 'domicilio' ? 'text-white' : 'text-gray-400'
                            }`}>
                            local_shipping
                        </span>
                    </div>
                    <div className="text-center">
                        <h4 className={`font-bold text-base sm:text-lg ${tipoEntrega === 'domicilio' ? 'text-primary' : 'text-text-main'
                            }`}>
                            Entrega a Domicilio
                        </h4>
                        <p className={`text-xs sm:text-sm font-medium mt-1 ${tipoEntrega === 'domicilio' ? 'text-primary/80' : 'text-text-secondary'
                            }`}>
                            +${costoEnvio.toLocaleString('es-AR')}
                        </p>
                    </div>
                    {tipoEntrega === 'domicilio' && (
                        <div className="absolute top-3 right-3">
                            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                        </div>
                    )}
                </button>

                {/* Opción Retiro */}
                <button
                    type="button"
                    onClick={() => onChangeTipoEntrega('retiro')}
                    className={`relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border-2 transition-all ${tipoEntrega === 'retiro'
                            ? 'border-green-500 bg-green-50 shadow-lg scale-[1.02]'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                        }`}
                >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${tipoEntrega === 'retiro' ? 'bg-green-500' : 'bg-gray-100'
                        }`}>
                        <span className={`material-symbols-outlined text-2xl sm:text-3xl ${tipoEntrega === 'retiro' ? 'text-white' : 'text-gray-400'
                            }`}>
                            storefront
                        </span>
                    </div>
                    <div className="text-center">
                        <h4 className={`font-bold text-base sm:text-lg ${tipoEntrega === 'retiro' ? 'text-green-600' : 'text-text-main'
                            }`}>
                            Retiro en Local
                        </h4>
                        <p className={`text-xs sm:text-sm font-medium mt-1 ${tipoEntrega === 'retiro' ? 'text-green-600/80' : 'text-text-secondary'
                            }`}>
                            ¡Gratis!
                        </p>
                    </div>
                    {tipoEntrega === 'retiro' && (
                        <div className="absolute top-3 right-3">
                            <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    )
}
