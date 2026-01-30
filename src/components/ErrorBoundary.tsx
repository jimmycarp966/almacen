'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, errorInfo)
        this.setState({ error, errorInfo })
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 text-red-900 rounded-xl border border-red-200">
                    <h2 className="text-2xl font-bold mb-4">Algo salió mal en este componente</h2>
                    <div className="bg-white p-4 rounded border border-red-100 overflow-auto font-mono text-xs mb-4">
                        <p className="font-bold text-red-600 mb-2">{this.state.error?.toString()}</p>
                        <pre>{this.state.errorInfo?.componentStack}</pre>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Reintentar
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
