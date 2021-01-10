define(["react", "components/PopupFrame"], function (React, PopupFrameClass) {
  var D = React.DOM;
  const PopupFrame = React.createFactory(PopupFrameClass);

  return React.createClass({
    displayName: "Menu",

    propTypes: {
      isMobileOrSmall: React.PropTypes.bool.isRequired,
    },

    getInitialState: function () {
      return { open: false };
    },

    _openSidebar: function () {
      this.setState({ open: true });
    },

    _closeSidebar: function (e) {
      if (e.currentTarget !== e.relatedTarget) {
        // if clicked outside
        this.setState({ open: false });
      }
    },

    render: function () {
      const { open } = this.state;

      return D.div(
        {
          tabIndex: 0,
          onBlur: this._closeSidebar,
          style: {
            outline: "none",
            display: "flex",
          },
        },
        D.div(
          { className: "hamburger", onClick: this._openSidebar },
          [1, 2, 3].map(() => D.div())
        ),
        React.createElement(
          "div",
          {
            className: "sidenav",
            style: {
              width: open ? "min(25rem, 75%)" : 0,
            },
          },
          PopupFrame({
            render: (open) =>
              React.createElement(
                "a",
                {
                  onClick: open,
                },
                "Investments"
              ),
            src: "/invest",
          }),
          PopupFrame({
            render: (open) =>
              React.createElement(
                "a",
                {
                  onClick: open,
                },
                "Statistics"
              ),
            src: "/stats",
          }),
          PopupFrame({
            render: (open) =>
              React.createElement(
                "a",
                {
                  onClick: open,
                },
                "Leaderboard"
              ),
            src: "/leaderboard",
          }),
          D.hr(),
          PopupFrame({
            render: (open) =>
              React.createElement(
                "a",
                {
                  onClick: open,
                },
                "Account"
              ),
            src: "/account",
          }),
          React.createElement(
            "a",
            {
              href: "#",
              onClick: () => {
                if (confirm("Are you sure you wish to log out?")) {
                  fetch("/logout", { method: "POST" }).then(() => {
                    location.href = "/";
                  });
                }
              },
            },
            "Logout"
          )
        )
      );
    },
  });
});
