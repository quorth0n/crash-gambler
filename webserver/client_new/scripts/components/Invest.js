define(["react"], function (React) {
  var D = React.DOM;

  return React.createClass({
    displayName: "Invest",

    getInitialState: () => ({ amount: 1e6, invest: "Invest" }),

    _onAmtChange: function (e) {
      this.setState({ ...this.state, amount: e.target.value });
    },

    _onInvestChange: function (e) {
      this.setState({ ...this.state, invest: e.target.value });
    },

    _handleSubmit: async function (e) {
      e.preventDefault();

      const { amount, invest } = this.state;
      console.log(invest);
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
    },

    render: function () {
      return D.div(
        { className: "investment-container" },
        D.h3(null, "Investment stats"),
        D.div(
          { className: "stats-grid" },
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, "0.00"),
            D.span({ className: "sub" }, "Total invested")
          ),
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, "0.00"),
            D.span({ className: "sub" }, "Total divested")
          ),
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, "0.00"),
            D.span({ className: "sub" }, "Profit")
          )
        ),
        D.div(
          { className: "stats-grid" },
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, "0.00"),
            D.span({ className: "sub" }, "Active investment")
          ),
          D.div(
            { className: "stat" },
            D.span({ className: "number" }, "0.00"),
            D.span({ className: "sub" }, "Stake")
          )
        ),
        D.ul(
          {
            style: {
              listStyle: "inside",
            },
          },
          D.li(null, "The minimum amount for investments is (100M satoshi)."),
          D.li(
            null,
            "A dilution fee of 1% will be applied to new investments, this dilution fee will be shared over to everyone with an active investment."
          ),
          D.li(
            null,
            "A commission of 0.20% of the wagered amount is charged on returns and loses for each game."
          )
        ),
        D.form(
          { className: "investment-form", onSubmit: this._handleSubmit },
          D.div(
            {},
            D.label(
              null,
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
              placeholder: 1e6,
              min: 1e6,
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
