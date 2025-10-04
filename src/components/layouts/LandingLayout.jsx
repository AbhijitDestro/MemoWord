export default function LandingLayout(props) {
  const { children } = props

  return (
    <div id="root" className="landing-page-root">
      <main>
        {children}
      </main>
      <footer>
        <small>Created by</small>
        <a target="_blank" href="https://github.com/AbhijitDestro">
          <img alt="pfp" src="https://avatars.githubusercontent.com/u/134042042?v=4" />
          <p>@AbhijitDestro</p>
          <i className="fa-brands fa-github"></i>
        </a>
      </footer>
    </div>
  )
}