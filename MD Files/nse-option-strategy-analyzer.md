# NSE Option Strategy Analyzer

## TL;DR
I built a Python tool that reads real NSE stock options data, figures out whether the market looks bullish, bearish, or range-bound, and suggests option trading strategies based on that view. I started it to teach myself quantitative finance and options trading from the ground up — not as a polished trading product.

## The Problem
I wanted to actually learn options trading and quant finance, not just read about it. Reading theory about implied volatility, Greeks, and strategies like iron condors only gets you so far — I wanted to work with real market data, compute real numbers, and see whether the theory held up when I tried to code it myself. So I set out to build a tool that could take raw NSE (National Stock Exchange, India) options data and turn it into an actual trading decision, end to end.

## What I Built
The project is a pipeline of modules that each handle one part of the process, from raw data to a final trade suggestion:

1. **Data Puller** – pulls a year's worth of options and price data for a stock straight from NSE and Yahoo Finance.
2. **Market Analyser** – looks at that data and forms a view: is implied volatility cheap or expensive right now? Is the stock trending or stuck in a range? Where are the big support/resistance levels based on where traders are positioned?
3. **Strategy Scorer** – takes that market view and picks two option strategies (like straddles, strangles, or iron condors) that make sense given the conditions, then works out the exact strikes, potential profit, potential loss, and breakeven points.
4. **Backtester** – rewinds the clock and asks "if I'd run this tool every month for the past year, would it have made money?"

Put simply: instead of me eyeballing a stock chart and guessing whether to buy a call or sell a strangle, the tool crunches the numbers and tells me what the data suggests — and then I can go check its homework.

## How It Works
Everything starts with raw NSE "bhavcopy" data — the exchange's daily dump of every options contract traded, which is exactly as unglamorous as it sounds (34 columns of exchange jargon that need cleaning). From there:

- I reverse-engineer implied volatility (IV) for every single option contract using the Black-Scholes model, since NSE only gives you the traded price, not the IV directly.
- I compute an **IV Rank** — essentially, "is volatility expensive or cheap right now compared to the last year?" — because that alone drives a huge part of which options strategy makes sense.
- I detect trend using SMA crossovers and ADX (a strength-of-trend indicator), so the tool doesn't just look at price direction, but also how convicted that direction is.
- I look at where traders have piled up the most open interest to find implied support and resistance levels, and I compute the put-call ratio as a sentiment gauge.
- All of these signals get combined into one directional score, which feeds into the strategy selector — which then prices out real option legs using Black-Scholes and tells me the expected profit, loss, and probability of profit.
- The backtester replays this whole process across a year of monthly expiry cycles to see how the strategy selection would have actually performed.

## Tech Stack
- **Python** as the core language
- **pandas / numpy** for data wrangling and time series work
- **scipy** for Black-Scholes pricing and solving for implied volatility (using Brent's method)
- **nselib** for pulling raw NSE F&O bhavcopy data
- **yfinance** for historical spot price data
- Plain CSVs as the data layer — no database, kept intentionally simple since this is a personal research tool

## Architecture & Key Technical Decisions
I split the project into clearly separated modules (data puller → market analyser → strategy scorer → backtester) rather than one big script, mainly because I wanted each piece to be independently testable and reusable. The backtester, for example, doesn't reimplement its own market analysis logic — it directly calls into the same `market_analyser` and `strategy_scorer` modules the live tool uses. That was a deliberate choice: I didn't want the backtest results to be based on logic that had quietly drifted from what the live tool actually does.

The strategy selection matrix — which strategy to suggest based on IV regime, trend direction, and ADX strength — is something I designed myself based on options theory I was studying (e.g., sell premium in high IV, buy premium in low IV, use directional trend + strength to decide between straddles/strangles vs iron condors). Codifying "textbook" options logic into an actual decision matrix was one of the more interesting parts of the project — it forced me to be precise about intuitions that sound simple in a book but are fuzzy once you try to turn them into rules.

For P&L in the backtester, I calculate outcomes using intrinsic value at expiry rather than the noisy `last_price` field, since option prices near expiry can be unreliable or stale in the exchange data. I also account for realistic frictions like brokerage per leg and slippage, since ignoring transaction costs would make any strategy look better than it really is.

## Challenges & Solutions
Working with raw exchange data taught me a lot that no textbook does. NSE bhavcopy data has holidays, missing days, and inconsistent formatting that I had to handle gracefully rather than crashing the pipeline. Computing implied volatility for tens of thousands of option contracts also isn't always well-behaved — Black-Scholes doesn't have a closed-form solution for IV, so I had to numerically solve for it (using Brent's method) and handle the cases where it simply doesn't converge, without letting a handful of bad rows corrupt the whole dataset. I also had to be careful about avoiding subtle bugs like the backtester silently using different logic from the live analyser — which is why I refactored it to call the same shared functions instead of duplicating logic.

## Results / Impact
This project is very much a work in progress and I'm treating it as a learning tool rather than something ready for real trading — the README says as much. Right now, strategy performance in backtests isn't strong, and that's expected and fine: the goal was never "make money on day one," it was to understand the mechanics of options pricing, volatility, and strategy selection well enough to build all of it myself. I've been working on this for about three weeks and I'm continuing to iterate on it, particularly around strike selection, expiry handling, and making the backtesting more robust.

## Links
- GitHub: https://github.com/Gautam-Kumaran/Option-Strategy-Analyzer
- Live site: Not deployed — this is currently a local CLI tool
