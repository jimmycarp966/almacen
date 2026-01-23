'use client'

interface CheckoutStepsProps {
    currentStep: number
    steps: string[]
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
    return (
        <div className="w-full mb-6 sm:mb-8">
            {/* Mobile: Indicador simple */}
            <div className="sm:hidden flex items-center justify-center gap-2 mb-4">
                <span className="text-sm font-bold text-text-main">
                    Paso {currentStep + 1} de {steps.length}
                </span>
                <span className="text-sm text-text-secondary">
                    — {steps[currentStep]}
                </span>
            </div>

            {/* Desktop: Stepper completo */}
            <div className="hidden sm:flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                        {/* Círculo del paso */}
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${index < currentStep
                                    ? 'bg-green-500 text-white'
                                    : index === currentStep
                                        ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30'
                                        : 'bg-gray-100 text-gray-400'
                                }`}>
                                {index < currentStep ? (
                                    <span className="material-symbols-outlined text-lg">check</span>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className={`mt-2 text-xs font-medium ${index === currentStep
                                    ? 'text-primary font-bold'
                                    : index < currentStep
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                }`}>
                                {step}
                            </span>
                        </div>

                        {/* Línea conectora */}
                        {index < steps.length - 1 && (
                            <div className={`w-16 lg:w-24 h-1 mx-2 rounded-full transition-all ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile: Barra de progreso */}
            <div className="sm:hidden w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
            </div>
        </div>
    )
}
