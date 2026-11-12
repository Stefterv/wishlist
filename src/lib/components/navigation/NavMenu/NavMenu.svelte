<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { Role } from "$lib/schema";
    import Avatar from "../../Avatar.svelte";
    import GroupSubMenu from "./GroupSubMenu.svelte";
    import { getFormatter } from "$lib/i18n";
    import GroupSelectChip from "$lib/components/wishlists/chips/GroupSelectChip.svelte";
    import Popup from "$lib/components/Popup.svelte";

    interface Props {
        user: LocalUser | null;
        groups: GroupInformation[] | null;
        isProxyUser: boolean;
    }

    const { user, groups, isProxyUser }: Props = $props();
    const t = getFormatter();

    let open = $state(false);

    const closeMenu = () => {
        open = false;
    };
</script>

{#if user}
    <div class="flex min-w-0 items-center gap-4">
        {#if groups && groups?.length > 1}
            <GroupSelectChip {groups} {user} />
        {/if}
        <Popup zIndex="z-20!" bind:open>
            {#snippet trigger(props)}
                <button class="size-10 md:size-12" {...props}>
                    <Avatar class="size-10 text-xs md:size-12 md:text-sm" {user} />
                    <span class="sr-only">User Menu</span>
                </button>
            {/snippet}
            {#snippet content(props)}
                <div {...props}>
                    <nav
                        class="card preset-filled-surface-100-900 list-nav p-4 shadow-xl"
                        data-testid="user menu navigation"
                    >
                        <ul>
                            <li>
                                <a href="/account" onclick={closeMenu}>
                                    <iconify-icon icon="ion:person"></iconify-icon>
                                    <span class="flex-auto">{$t("admin.account")}</span>
                                </a>
                            </li>
                            {#if user.roleId == Role.ADMIN}
                                <li>
                                    <a href="/admin" onclick={closeMenu}>
                                        <iconify-icon icon="ion:settings"></iconify-icon>
                                        <span class="flex-auto">{$t("admin.admin")}</span>
                                    </a>
                                </li>
                            {/if}

                            <hr class="hr" />
                            <GroupSubMenu {groups} onSelect={closeMenu} {user} />
                            {#if !isProxyUser}
                                <hr class="hr" />
                                <li>
                                    <button
                                        class="list-option w-full"
                                        onclick={async () => {
                                            closeMenu();
                                            await fetch("/logout", { method: "POST" });
                                            invalidateAll();
                                        }}
                                    >
                                        <iconify-icon icon="ion:log-out"></iconify-icon>
                                        <p>{$t("auth.sign-out")}</p>
                                    </button>
                                </li>
                            {/if}
                        </ul>
                    </nav>
                </div>
            {/snippet}
        </Popup>
    </div>
{/if}
