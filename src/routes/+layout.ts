import type { LayoutLoad } from "./$types";
import { initFormatter, initLang } from "$lib/i18n";

export const load = (async ({ data }) => {
    // The server always picks Dutch (see hooks.server.ts)
    const locale = data.locale;
    await initLang(locale);

    return {
        t: await initFormatter(locale),
        ...data,
        locale
    };
}) satisfies LayoutLoad;
