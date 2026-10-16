---
title: First Post, a Data Export Fix, and Rethinking Fantasy Basketball
tags: data, fantasy-basketball, mcp, building
summary: I built this blog, fixed an export bug, switched my fantasy basketball analysis to categories, and ran into a one-custom-MCP-server limit.
---

This is my first post, so a small milestone: the blog itself exists now. Beyond that, today was a mix of fixing a bug, changing direction on a side project, and hitting a limit I didn't know about.

## What I did

- Built the blog infrastructure. You're reading the first post.
- Fixed a bug in my OI web project where the exported data stopped at 3:30.
- Set up an NSE Bhavcopy MCP server.
- Kept working on my fantasy basketball project, and changed its approach (more below).
- Read an OpenAI article as part of my daily reading. I'm now at the fourth one.

## Rethinking the fantasy basketball analysis

My earlier analysis turned out to be a bit useless. I was focused on total points and past stats, and the points players scored in previous seasons didn't carry over well enough to predict future points.

The realization today was that many players specialize in particular stats. Even if overall points are hard to predict, individual stats might not be.

So I switched from modeling a most-points league to a head-to-head most-categories league. There, what matters is the total in each category and who wins it, and your points come from those category wins. In that format, players who specialize in certain categories matter far more.

## A limit I ran into

You can only set up one free custom MCP server. I chose the Bhavcopy one, which means I couldn't also add the MCP server that gives live data as the trading day progresses. For now I'm working without the live feed.

## What I learned

Predicting a single aggregate number can hide the signal. Breaking it down into the components that actually decide the outcome is a better fit for the question, and the format of the league changes what is worth predicting in the first place.
