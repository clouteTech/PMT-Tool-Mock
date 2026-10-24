
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3B82F6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
        },

        colorScheme: {
            light: {
                primary: {
                    color: '#3B82F6',
                    contrastColor: '#ffffff',
                    hoverColor: '#2563EB',
                    activeColor: '#1D4ED8'
                },

                highlight: {
                    background: '#DBEAFE',
                    focusBackground: '#BFDBFE',
                    color: '#1D4ED8',
                    focusColor: '#1E40AF'
                }
            },

            dark: {
                primary: {
                    color: '#60A5FA',
                    contrastColor: '#172554',
                    hoverColor: '#93C5FD',
                    activeColor: '#BFDBFE'
                },

                highlight: {
                    background: 'rgba(59, 130, 246, .16)',
                    focusBackground: 'rgba(59, 130, 246, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});
