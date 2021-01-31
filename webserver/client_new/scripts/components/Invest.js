define(["react"], function (React) {
  var D = React.DOM;

  return React.createClass({
    displayName: "Invest",

    getInitialState: () => ({ amount: 1e5, invest: "Invest", stats: {} }),

    componentDidMount: async function () {
      const stats = await fetch("/invest").then((d) => d.json());

      this.setState({
        ...this.state,
        stats,
      });
    },

    _onAmtChange: function (e) {
      this.setState({ ...this.state, amount: e.target.value });
    },

    _onInvestChange: function (e) {
      this.setState({ ...this.state, invest: e.target.value });
    },

    _handleSubmit: async function (e) {
      e.preventDefault();

      this.setState({
        ...this.state,
        error: null,
      });

      const { amount, invest } = this.state;

      const res = await fetch("/invest", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(amount) * (invest === "Invest" ? 1 : -1),
        }),
      }).then((d) => d.json());

      if (!res.success) {
        this.setState({
          error: res.error,
        });
      }

      const stats = await fetch("/invest").then((d) => d.json());

      this.setState({
        ...this.state,
        stats,
      });
    },

    render: function () {
      const {
        total_invested,
        total_divested,
        balance,
        total_investments,
      } = this.state.stats;

      return D.div(
        { className: "investment-container" },
        D.div(
          { className: "stats-grid" },
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, total_invested || "0.00"),
            D.span({ className: "sub" }, "Total invested")
          ),
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, total_divested || "0.00"),
            D.span({ className: "sub" }, "Total divested")
          ),
          D.div(
            { className: "stat" },
            D.span(
              {
                className: "number",
                style: {
                  color:
                    balance - (total_invested + total_divested) < 0
                      ? "red"
                      : "green",
                },
              },
              balance - (total_invested + total_divested) || "0.00"
            ),
            D.span(
              {
                className: "sub",
              },
              "Profit"
            )
          )
        ),
        D.div(
          { className: "stats-grid" },
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, balance || "0.00"),
            D.span({ className: "sub" }, "Active investment")
          ),
          D.div(
            { className: "stat" },
            D.span(
              { className: "number" },
              `${((balance / total_investments) * 100 || 0).toFixed(2)}%`
            ),
            D.span({ className: "sub" }, "Stake")
          )
        ),
        D.ul(
          {
            style: {
              listStyle: "inside",
              marginTop: "2rem",
            },
          },
          D.li(null, "The minimum amount for investments is 100k satoshi."),
          D.li(
            null,
            "A dilution fee of 1% will be applied to new investments, this dilution fee will be shared over to everyone with an active investment."
          ),
          D.li(
            null,
            "A commission of 0.39% of the wagered amount is charged on returns and loses for each game."
          )
        ),
        D.form(
          { className: "investment-form", onSubmit: this._handleSubmit },
          D.div(
            { className: "radios" },
            D.label(
              {
                style: {
                  marginRight: "1rem",
                },
              },
              D.input({
                type: "radio",
                value: "Invest",
                checked: this.state.invest === "Invest",
                onChange: this._onInvestChange,
              }),
              "Invest"
            ),
            D.label(
              null,
              D.input({
                type: "radio",
                value: "Divest",
                checked: this.state.invest === "Divest",
                onChange: this._onInvestChange,
              }),
              "Divest"
            )
          ),
          D.div(
            {
              style: {
                display: "flex",
              },
            },
            D.label({ htmlFor: "amount" }, "Satoshis amount: "),
            D.input({
              id: "amount",
              type: "number",
              placeholder: 1e5,
              min: 1e5,
              max: Number.MAX_VALUE,
              value: this.state.amount,
              onChange: this._onAmtChange,
            })
          ),
          this.state.error &&
            D.p({ className: "error" }, `Error: ${this.state.error}`),
          D.input({
            type: "submit",
            value: "Submit",
          })
        )
      );
    },
  });
});
