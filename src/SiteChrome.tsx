import { PremiumHeader, PremiumFooter } from "./PremiumSite";
type Props = { contactUrl?: string; navigationId?: string; animated?: boolean };
export function SiteHeader(_props: Props) { return <PremiumHeader/>; }
export function SiteFooter(_props: Props) { return <PremiumFooter/>; }
