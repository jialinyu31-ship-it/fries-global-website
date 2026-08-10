import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; signedout?: string }> }) {
  const cookieStore = await cookies();
  if (verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)) redirect("/admin");
  const params = await searchParams;

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <div className="admin-login-brand" aria-label="Fries Global">
          <Image src="/brand-symbol.png" alt="" width={58} height={58} priority />
          <div><strong>薯条出海</strong><span>SECURITY CONSOLE</span></div>
        </div>
        <div className="admin-login-heading">
          <span className="admin-kicker">PRIVATE ACCESS</span>
          <h1>网站管理后台</h1>
          <p>访问统计、安全事件与运行状态仅供管理员查看。</p>
        </div>
        {params.error ? <p className="admin-alert admin-alert--error" role="alert">账号或密码不正确，请重新输入。</p> : null}
        {params.signedout ? <p className="admin-alert">已经安全退出后台。</p> : null}
        <form action="/admin/api/login" method="post" className="admin-login-form">
          <label>管理员账号<input name="username" type="text" autoComplete="username" required maxLength={80} /></label>
          <label>管理员密码<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
          <label className="admin-honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          <button type="submit">安全登录 <span>→</span></button>
        </form>
        <div className="admin-login-foot">
          <span>会话将在 4 小时后自动失效</span>
          <span>登录受限流与 CSRF 防护保护</span>
        </div>
      </section>
      <aside className="admin-login-visual" aria-hidden="true">
        <div className="admin-orbit admin-orbit--one" /><div className="admin-orbit admin-orbit--two" />
        <div className="admin-visual-copy"><span>FRIES GLOBAL</span><strong>See clearly.<br />Respond early.</strong><p>Anonymous traffic intelligence<br />for a safer global website.</p></div>
      </aside>
    </main>
  );
}
