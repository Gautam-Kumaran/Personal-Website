# Entropy in the Stock Market

## TL;DR
I used entropy — a concept borrowed straight from statistical physics — to study whether Indian IT stocks quietly "synchronize" into ordered states, and how they snap back to normal once they do. Turns out they really do coordinate, and recovering from that state happens in two very different phases: a fast one that's predictable, and a slow one that basically isn't.

## The Problem
This started as an undergraduate physics thesis, and honestly, the origin was pretty simple: I found the topic interesting. I've always liked the idea that concepts from physics — entropy, relaxation, equilibrium — aren't just for particles and gases, they show up in systems that "shouldn't" behave like physical systems at all. Financial markets are the obvious playground for this: millions of independent decisions producing something that sometimes looks structured and sometimes looks like pure noise.

The specific question I wanted to answer was two-fold. First: when a stock enters a period of unusually low "directional randomness" (i.e., it starts moving up or down with unusual persistence), does that happen in isolation, or do other stocks in the same sector tend to enter that state at the same time? Second: once a stock is in that ordered state, how does it come back to normal — is the way it recovers determined by how deep the event was, or is it mostly just noise?

## What I Built
I built a full research pipeline — from raw data to final figures — that treats stock price movements the way you'd treat a physical system moving away from equilibrium. Instead of looking at how *much* a stock moved on a given day, I only looked at *direction*: up or down. That simplification is deliberate — it strips away magnitude and leaves you with something you can measure the "disorder" of, using Shannon entropy, the same entropy that shows up in information theory and thermodynamics.

I ran this across 14 stocks in the Indian IT sector (Infosys, TCS, Wipro, HCL Tech, and others) plus the NIFTY IT index as a sector-wide reference, using roughly 20 years of daily price data. From there, I built machinery to detect when a stock has entered a "low-entropy" — i.e., unusually ordered — state, checked whether multiple stocks tend to enter that state together more than pure chance would predict, and then tracked exactly how each stock climbs back out of it.

## How It Works
The pipeline runs in five stages, each as its own script:

1. **Data collection** — pulls 20+ years of daily prices for 14 IT-sector stocks and the NIFTY IT index via `yfinance`, normalizing awkward MultiIndex/column formats along the way and logging a coverage summary so I could catch gaps or failed downloads.
2. **Data processing** — turns raw prices into log returns, filters extreme outliers with a 10-sigma cutoff, and converts each day into a binary symbol: 1 if the stock went up, 0 if it didn't.
3. **Entropy calculation** — computes rolling Shannon entropy over that binary sequence for multiple window sizes, flags "low-entropy" days using a stock-specific statistical threshold, and tests whether multiple stocks hitting low entropy at once is a real, coordinated phenomenon or just what you'd expect from independent stocks occasionally lining up.
4. **Relaxation analysis** — for every low-entropy episode, tracks how the stock's entropy climbs back up, measuring two different kinds of "recovery": time to cross back over the threshold, and time to return all the way to the stock's typical (mean) entropy level.
5. **Sanity checks** — a final pass of descriptive statistics, correlation analysis, and t-tests across the full episode-level dataset, to make sure the results weren't artifacts of how I built the pipeline.

## Tech Stack
Python for the entire pipeline — `pandas` and `numpy` for data wrangling and the actual entropy/statistics math, `yfinance` for data collection, `scipy.stats` for the statistical tests (t-tests, Pearson correlation, binomial tests), and `matplotlib` for all the figures. No databases or infra beyond local CSVs — this was a research pipeline, not a production system, so the priority was reproducibility and clean intermediate outputs at every stage rather than speed or scale.

## Architecture & Key Technical Decisions
The core design decision was to represent price movement as a **binary symbolic sequence** rather than working with raw returns. This is a classic move in statistical physics — you throw away magnitude and just look at the "state" (up/down), which lets you compute Shannon entropy over a rolling window as a genuine measure of directional uncertainty. It's a deliberate trade-off: you lose information about *how big* a move was, but you gain a clean, interpretable measure of *how ordered* the recent sequence of moves has been.

For defining "low entropy," I didn't use a single global cutoff — each stock gets its own threshold, computed as its own mean entropy minus some multiple (Z) of its own standard deviation. This matters because different stocks have very different baseline volatility and entropy characteristics; a threshold that's meaningful for TCS isn't necessarily meaningful for a smaller, choppier stock like RAMCOSYS.

The most interesting piece of the whole project, and probably the part I'm proudest of, is the **coordination test**. To ask "do stocks enter low-entropy states together more than chance would predict?" I needed a proper statistical baseline — not just eyeballing overlapping dips on a chart. I built this using a **Poisson-binomial null model**: each stock has its own empirically estimated probability of being in a low-entropy state on any given day, and under the null hypothesis that stocks act independently, the *number* of stocks simultaneously in that state follows a Poisson-binomial distribution (a generalization of the binomial distribution that allows each trial to have a different success probability). I picked a significance threshold K such that observing that many stocks low-entropy at once would be very unlikely by chance, then checked how often the real data actually crossed that threshold — and it did, far more often than the null model predicted.

I also swept across four window sizes (20, 30, 45, 60 trading days) and five Z-score thresholds to make sure none of this was an artifact of arbitrary parameter choices, before locking in W=45, Z=1.75 as the baseline for the deeper analysis.

## Challenges & Solutions
The messiest part, by far, was the data itself. Yahoo Finance's API has a habit of returning inconsistent column structures — sometimes flat, sometimes a MultiIndex — and tickers that are valid one day can silently stop returning data. I handled this by writing a dedicated normalization layer that flattens whatever structure comes back into a consistent Date/Price format, and by generating an automatic coverage summary after every download run so I could immediately see which tickers had failed or returned suspiciously short histories, rather than discovering it three steps downstream.

The harder, more conceptual challenge was building a coordination test that could actually withstand scrutiny. It would have been easy to just say "look, these dips line up on the chart" — but that's not a real statistical claim. Getting the Poisson-binomial null model right (accounting for each stock having its own baseline probability of being low-entropy, rather than assuming they're all identical) took some care, and I cross-checked it against the empirical distribution before trusting the result.

## Results / Impact
The headline finding: low-entropy states are genuinely coordinated. Under the baseline parameters, the model predicts a significance threshold of K=4 simultaneous stocks — and the real data hit that threshold 111 times, far more than the independence-based null model would expect. This held up across the full parameter sweep, so it isn't an artifact of one specific choice of window size or threshold.

The recovery analysis surfaced something I didn't fully expect going in: recovery happens on **two distinct timescales**. Stocks exit the low-entropy threshold quickly — a mean of about 6.2 days — but take much longer, around 25.7 days on average, to fully return to their typical entropy level. And these two stages behave very differently: how deep a stock's entropy dropped strongly predicts how fast it crosses back over the threshold (r ≈ 0.76), but that same depth barely predicts how long the *full* recovery to normal takes (r ≈ 0.26). Neither sector-wide conditions nor whether the event was part of a coordinated, multi-stock episode had a meaningful effect on recovery time either. The picture that emerged is that markets have a structured, almost deterministic early-recovery phase, followed by a much more stochastic, harder-to-predict tail.

This was roughly a year and a half (three-quarters of the full academic year) of work, done independently under two supervisors, and it's complete as an undergraduate thesis. I'm planning to feed these results into a separate options strategy analyzer project that's currently still in early ideation.

## Links
- GitHub: [https://github.com/Gautam-Kumaran/Entropy-in-the-stock-market](https://github.com/Gautam-Kumaran/Entropy-in-the-stock-market)
