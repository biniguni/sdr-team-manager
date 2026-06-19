import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks } from "@/components/layout/navLinks";
import { getAuthStatus } from "@/lib/authz";

export async function MobileNav() {
  const { user, canEdit } = await getAuthStatus();

  return <MobileMenu links={navLinks} user={Boolean(user)} canEdit={canEdit} />;
}
