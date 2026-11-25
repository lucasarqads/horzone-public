/**
 * Dados de contato usados no rodapé e no botão fixo do WhatsApp.
 * WHATSAPP_NUMERO: só dígitos, com DDI + DDD (ex.: '5511999999999'). Vazio = os botões de contato abrem o e-mail.
 */
export const WHATSAPP_NUMERO = '5511913340707' // (11) 91334-0707
export const WHATSAPP_MENSAGEM = 'Olá! Vim pelo site da Horzone e quero conversar.'
export const EMAIL = 'horzonetecnologia@gmail.com'

export const linkWhatsapp = () =>
  WHATSAPP_NUMERO
    ? `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`
    : `mailto:${EMAIL}`
