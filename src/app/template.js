// 每次导航重挂载（template 约定），入场只做 opacity——不套 transform，sticky 因此可用
export default function Template({ children }) {
  return <div className="pageEnter">{children}</div>
}
