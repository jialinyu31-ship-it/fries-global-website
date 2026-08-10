"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AnalyticsSummary } from "@/lib/analytics";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity, AlertTriangle, ArrowDownToLine, Bot, ChevronRight, CircleDot,
  Clock3, Eye, Globe2, LayoutDashboard, LockKeyhole, MonitorSmartphone,
  RefreshCw, ShieldCheck, Smartphone, UsersRound,
} from "lucide-react";

function displayTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(new Date(value));
}

function TrendChart({ data }: { data: AnalyticsSummary["hourly"] }) {
  const width = 720;
  const height = 190;
  const max = Math.max(1, ...data.map((item) => item.views));
  const points = data.map((item, index) => {
    const x = (index / Math.max(1, data.length - 1)) * width;
    const y = height - (item.views / max) * (height - 22) - 8;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="admin-chart-wrap">
      <svg className="admin-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="最近 24 小时浏览趋势">
        <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff8516" stopOpacity=".3" /><stop offset="1" stopColor="#ff8516" stopOpacity="0" /></linearGradient></defs>
        <line x1="0" y1="48" x2={width} y2="48" /><line x1="0" y1="96" x2={width} y2="96" /><line x1="0" y1="144" x2={width} y2="144" />
        <polygon points={area} fill="url(#chart-fill)" /><polyline points={points} fill="none" stroke="#ff8516" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="admin-chart-labels"><span>{data[0]?.label}</span><span>{data[6]?.label}</span><span>{data[12]?.label}</span><span>{data[18]?.label}</span><span>{data[23]?.label}</span></div>
    </div>
  );
}

function Ranking({ title, icon, data }: { title: string; icon: React.ReactNode; data: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <section className="admin-panel admin-ranking">
      <div className="admin-panel-title"><span>{icon}</span><h2>{title}</h2></div>
      <div className="admin-rank-list">
        {data.length ? data.map((item, index) => (
          <div className="admin-rank" key={item.label}>
            <div><span className="admin-rank-number">{String(index + 1).padStart(2, "0")}</span><strong title={item.label}>{item.label}</strong><b>{item.value}</b></div>
            <i><span style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }} /></i>
          </div>
        )) : <div className="admin-empty">等待产生访问数据</div>}
      </div>
    </section>
  );
}

export function AdminDashboard({ initialData }: { initialData: AnalyticsSummary }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/admin/api/summary", { cache: "no-store", credentials: "same-origin" });
      if (response.status === 401) { router.push("/admin/login"); return; }
      if (!response.ok) throw new Error("Refresh failed");
      setData(await response.json() as AnalyticsSummary);
      setRefreshError(false);
    } catch {
      setRefreshError(true);
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setInterval(refresh, 15_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const lastUpdate = useMemo(() => displayTime(data.generatedAt), [data.generatedAt]);

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-side-brand" href="/admin"><Image src="/brand-symbol.png" alt="" width={46} height={46} priority /><div><strong>薯条出海</strong><span>CONTROL CENTER</span></div></Link>
        <nav aria-label="后台导航">
          <a className="is-active" href="#overview"><LayoutDashboard />总览</a>
          <a href="#visitors"><UsersRound />访客设备</a>
          <a href="#security"><ShieldCheck />安全事件</a>
          <Link href="/admin/api/export" prefetch={false}><ArrowDownToLine />导出数据</Link>
        </nav>
        <div className="admin-side-security"><LockKeyhole /><div><strong>取证加密已开启</strong><span>完整 IP 仅管理员可见</span></div></div>
        <Link className="admin-view-site" href="/en" target="_blank" rel="noreferrer">打开网站 <ChevronRight /></Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-kicker">FRIES GLOBAL INTELLIGENCE</span><h1>网站运行总览</h1></div>
          <div className="admin-top-actions">
            <span className="admin-health"><i /><b>系统正常</b></span>
            <button onClick={refresh} disabled={refreshing}><RefreshCw className={refreshing ? "is-spinning" : ""} />{refreshing ? "刷新中" : "刷新"}</button>
            <form action="/admin/api/logout" method="post"><button type="submit">退出</button></form>
          </div>
        </header>

        <section className="admin-status-strip">
          <span><CircleDot />实时统计每 15 秒更新</span><span><Clock3 />最后更新：{lastUpdate}</span>
          {refreshError ? <strong>刷新失败，正在自动重试</strong> : <span>数据保存 30 天</span>}
        </section>

        <section className="admin-metrics" id="overview">
          <article className="admin-metric admin-metric--accent"><div><span>当前在线</span><strong>{data.onlineNow}</strong><small>最近 2 分钟活跃设备</small></div><Activity /></article>
          <article className="admin-metric"><div><span>24 小时浏览量</span><strong>{data.views24h}</strong><small>页面访问次数</small></div><Eye /></article>
          <article className="admin-metric"><div><span>独立设备</span><strong>{data.unique24h}</strong><small>匿名设备指纹去重</small></div><MonitorSmartphone /></article>
          <article className="admin-metric admin-metric--warning"><div><span>安全取证</span><strong>{data.forensics.events24h}</strong><small>最近 24 小时加密证据</small></div><ShieldCheck /></article>
        </section>

        <section className="admin-overview-grid">
          <article className="admin-panel admin-traffic-panel">
            <div className="admin-panel-heading"><div><span className="admin-kicker">TRAFFIC</span><h2>最近 24 小时访问趋势</h2></div><div className="admin-inline-stats"><span><b>{data.views7d}</b>近 7 天</span><span><b>{data.bot24h}</b>机器人访问</span></div></div>
            <TrendChart data={data.hourly} />
          </article>
          <Ranking title="访客国家 / 地区" icon={<Globe2 />} data={data.topCountries} />
        </section>

        <section className="admin-ranking-grid">
          <Ranking title="热门页面" icon={<Eye />} data={data.topPages} />
          <Ranking title="设备类型" icon={<Smartphone />} data={data.topDevices} />
          <Ranking title="访问来源" icon={<Globe2 />} data={data.topReferrers} />
        </section>

        <section className="admin-panel admin-table-panel" id="visitors">
          <div className="admin-panel-heading"><div><span className="admin-kicker">EXACT CONNECTION LOG</span><h2>最近访问连接</h2></div><span className="admin-privacy-note admin-privacy-note--sensitive">完整 IP · 仅管理员可见 · 加密存盘</span></div>
          <div className="admin-table-scroll"><table><thead><tr><th>最后访问</th><th>原始 IP</th><th>位置 / 边缘节点</th><th>设备型号</th><th>系统与浏览器</th><th>页面</th><th>取证详情</th></tr></thead><tbody>
            {data.forensics.connections.length ? data.forensics.connections.map((visitor) => <tr key={visitor.id}>
              <td>{displayTime(visitor.at)}</td>
              <td><span className="admin-exact-ip">{visitor.sourceIp}</span><small>指纹 {visitor.fingerprint.slice(0, 10)}</small></td>
              <td><strong>{visitor.country}{visitor.city ? ` · ${visitor.city}` : ""}</strong><small>{visitor.edgeColo ? `Cloudflare ${visitor.edgeColo}` : visitor.sourceType}</small></td>
              <td><strong>{visitor.deviceModel}</strong><small>{visitor.mobileHint === "?1" ? "移动设备" : "桌面或未知设备"}</small></td>
              <td><strong>{visitor.uaPlatform || "平台未报告"} {visitor.platformVersion}</strong><small>{visitor.architecture || "架构未知"}{visitor.bitness ? ` · ${visitor.bitness}-bit` : ""}</small></td>
              <td><code>{visitor.path}</code></td>
              <td><details className="admin-forensic-detail"><summary>展开</summary><dl><dt>Ray ID</dt><dd>{visitor.rayId || "未提供"}</dd><dt>完整版本</dt><dd>{visitor.fullVersionList || visitor.browserBrands || "未提供"}</dd><dt>User-Agent</dt><dd>{visitor.userAgent || "未提供"}</dd><dt>来源</dt><dd>{visitor.referrer || "直接访问 / 未提供"}</dd><dt>证据 ID</dt><dd>{visitor.id}</dd></dl></details></td>
            </tr>) : <tr><td colSpan={7}><div className="admin-empty">等待新的访问连接；启用后产生的记录会在这里显示完整 IP。</div></td></tr>}
          </tbody></table></div>
        </section>

        <section className="admin-panel admin-table-panel" id="security">
          <div className="admin-panel-heading"><div><span className="admin-kicker">ENCRYPTED FORENSIC VAULT</span><h2>攻击溯源证据</h2></div><Link href="/admin/api/forensics" prefetch={false}>导出 JSON 证据包 <ArrowDownToLine /></Link></div>
          <div className="admin-forensic-strip">
            <span><b>{data.forensics.uniqueSources24h}</b>独立攻击源 IP</span><span><b>{data.forensics.critical24h}</b>严重事件</span><span><b>{data.forensics.retentionDays} 天</b>加密保留</span><span className={data.forensics.integrity.verified ? "is-verified" : "is-broken"}><b>{data.forensics.integrity.verified ? "完整" : "异常"}</b>证据链校验</span>
          </div>
          <div className="admin-table-scroll"><table><thead><tr><th>时间 / 等级</th><th>原始 IP</th><th>国家 / 节点</th><th>攻击请求</th><th>状态与原因</th><th>Cloudflare Ray ID</th><th>设备与证据</th></tr></thead><tbody>
            {data.forensics.events.length ? data.forensics.events.map((event) => <tr key={event.id}>
              <td>{displayTime(event.at)}<small><span className={`admin-severity admin-severity--${event.severity}`}>{event.severity}</span></small></td>
              <td><span className="admin-exact-ip">{event.sourceIp}</span><small>指纹 {event.fingerprint.slice(0, 10)}</small></td>
              <td><strong>{event.country}{event.city ? ` · ${event.city}` : ""}</strong><small>{event.edgeColo ? `Cloudflare ${event.edgeColo}` : event.sourceType}</small></td>
              <td><code>{event.method} {event.path}{event.query}</code><small>特征 {event.signature}</small></td>
              <td><span className={`admin-status admin-status--${event.status}`}>{event.status}</span><small>{event.reason}</small></td>
              <td><span className="admin-ray-id">{event.rayId || "未提供"}</span></td>
              <td><details className="admin-forensic-detail"><summary>完整证据</summary><dl><dt>设备型号</dt><dd>{event.deviceModel}</dd><dt>平台</dt><dd>{event.uaPlatform || "未报告"} {event.platformVersion} {event.architecture} {event.bitness}</dd><dt>浏览器版本</dt><dd>{event.fullVersionList || event.browserBrands || "未报告"}</dd><dt>User-Agent</dt><dd>{event.userAgent || "未提供"}</dd><dt>语言</dt><dd>{event.acceptLanguage || "未提供"}</dd><dt>来源页</dt><dd>{event.referrer || "未提供"}</dd><dt>主机 / 协议</dt><dd>{event.protocol}://{event.host}</dd><dt>证据 ID</dt><dd>{event.id}</dd></dl></details></td>
            </tr>) : <tr><td colSpan={7}><div className="admin-empty admin-empty--safe"><ShieldCheck />取证功能已开启，等待新的安全事件</div></td></tr>}
          </tbody></table></div>
        </section>

        <footer className="admin-footer"><span>Fries Global Security Console</span><span><Bot />自动流量识别已开启</span><span><AlertTriangle />统计结果用于趋势判断，不代表访客真实身份</span></footer>
      </main>
    </div>
  );
}
