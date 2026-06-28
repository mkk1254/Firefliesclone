from datetime import datetime, timedelta
from app.models import Meeting, Participant, TranscriptSegment, Summary, ActionItem

SPEAKER_COLORS = ["#7c3aed", "#2563eb", "#16a34a", "#dc2626", "#d97706"]

MEETINGS_DATA = [
    {
        "title": "Q2 Product Roadmap Review",
        "date": datetime.utcnow() - timedelta(days=1),
        "duration_seconds": 3240,
        "participants": [
            {"name": "Sarah Chen", "email": "sarah@company.com", "color": "#7c3aed"},
            {"name": "Marcus Reid", "email": "marcus@company.com", "color": "#2563eb"},
            {"name": "Priya Nair", "email": "priya@company.com", "color": "#16a34a"},
        ],
        "transcript": [
            {"speaker": "Sarah Chen", "text": "Good morning everyone, let's get started with the Q2 roadmap review. We have a lot to cover today.", "start": 0, "end": 8},
            {"speaker": "Marcus Reid", "text": "Thanks Sarah. Before we dive in, I want to flag that the mobile team has some bandwidth concerns for Q2.", "start": 9, "end": 17},
            {"speaker": "Priya Nair", "text": "Yes, we're currently at about 90% capacity with the ongoing infrastructure migration.", "start": 18, "end": 25},
            {"speaker": "Sarah Chen", "text": "Understood. Let's reprioritize accordingly. The three core features for Q2 are: the new onboarding flow, the analytics dashboard v2, and the API rate limiting improvements.", "start": 26, "end": 40},
            {"speaker": "Marcus Reid", "text": "The onboarding flow is already 60% done. We should be able to ship that by end of April.", "start": 41, "end": 49},
            {"speaker": "Priya Nair", "text": "Analytics dashboard will need design sign-off first. Can we get a design review scheduled this week?", "start": 50, "end": 58},
            {"speaker": "Sarah Chen", "text": "Absolutely. I'll reach out to the design team today. Marcus, what's the current status on the API work?", "start": 59, "end": 67},
            {"speaker": "Marcus Reid", "text": "API rate limiting is at spec stage. We estimate about three weeks of engineering work once specs are finalized.", "start": 68, "end": 78},
            {"speaker": "Priya Nair", "text": "We should also consider the database performance issues we've been seeing. Those need to be addressed in Q2 or we'll hit scalability problems in Q3.", "start": 79, "end": 92},
            {"speaker": "Sarah Chen", "text": "Good point. Let's add a database optimization spike to the backlog. I'll work with the team leads to scope it properly.", "start": 93, "end": 103},
            {"speaker": "Marcus Reid", "text": "Should we also discuss the customer-facing changelog? Our users keep asking for better visibility into what we're shipping.", "start": 104, "end": 114},
            {"speaker": "Priya Nair", "text": "That's a quick win actually. We could use our existing blog infrastructure and just create a dedicated changelog page.", "start": 115, "end": 125},
            {"speaker": "Sarah Chen", "text": "Love it. Let's make that a stretch goal for Q2. Okay, let's move on to timelines and dependencies.", "start": 126, "end": 135},
            {"speaker": "Marcus Reid", "text": "One dependency I want to flag: the onboarding flow needs the new auth tokens feature to be done first.", "start": 136, "end": 145},
            {"speaker": "Priya Nair", "text": "Auth tokens are nearly done. Should be merged by Friday.", "start": 146, "end": 152},
            {"speaker": "Sarah Chen", "text": "Perfect. Let's reconvene next Monday for a check-in. I'll send a recap email with all the action items.", "start": 153, "end": 162},
        ],
        "summary": {
            "overview": "The team reviewed the Q2 product roadmap, covering three core features: onboarding flow redesign, analytics dashboard v2, and API rate limiting. Bandwidth concerns from the mobile team were noted, and priorities were adjusted. Database optimization was added to the backlog as a critical item.",
            "key_topics": ["Q2 roadmap priorities", "Mobile team bandwidth", "Onboarding flow", "Analytics dashboard", "API rate limiting", "Database optimization"],
            "chapters": [
                {"title": "Opening & Bandwidth Concerns", "start_time_hint": 0},
                {"title": "Q2 Feature Review", "start_time_hint": 26},
                {"title": "Dependencies & Timeline", "start_time_hint": 136},
                {"title": "Wrap-up & Next Steps", "start_time_hint": 153},
            ],
        },
        "action_items": [
            {"text": "Schedule design review for analytics dashboard v2", "assignee": "Sarah Chen", "due_date": "2025-04-18", "completed": True},
            {"text": "Finalize API rate limiting specs", "assignee": "Marcus Reid", "due_date": "2025-04-22", "completed": False},
            {"text": "Scope database optimization spike", "assignee": "Sarah Chen", "due_date": "2025-04-25", "completed": False},
            {"text": "Merge auth tokens feature by Friday", "assignee": "Priya Nair", "due_date": "2025-04-19", "completed": True},
            {"text": "Send recap email with action items", "assignee": "Sarah Chen", "due_date": "2025-04-16", "completed": True},
        ],
    },
    {
        "title": "Engineering Weekly Standup",
        "date": datetime.utcnow() - timedelta(days=3),
        "duration_seconds": 1800,
        "participants": [
            {"name": "Alex Kim", "email": "alex@company.com", "color": "#7c3aed"},
            {"name": "Jordan Lee", "email": "jordan@company.com", "color": "#2563eb"},
            {"name": "Sam Patel", "email": "sam@company.com", "color": "#16a34a"},
            {"name": "Dana Torres", "email": "dana@company.com", "color": "#dc2626"},
        ],
        "transcript": [
            {"speaker": "Alex Kim", "text": "Alright team, let's do quick updates. Jordan, kick us off.", "start": 0, "end": 7},
            {"speaker": "Jordan Lee", "text": "Yesterday I finished the unit tests for the payment module. Today I'm starting the integration tests. No blockers.", "start": 8, "end": 18},
            {"speaker": "Sam Patel", "text": "I'm working on the search indexing improvements. Hit a snag with Elasticsearch mappings yesterday but figured it out this morning.", "start": 19, "end": 30},
            {"speaker": "Dana Torres", "text": "I deployed the new CDN configuration to staging. Performance looks great — load times dropped by 40%. Moving to production review today.", "start": 31, "end": 43},
            {"speaker": "Alex Kim", "text": "Excellent work Dana. Sam, do you need any support with the search work?", "start": 44, "end": 51},
            {"speaker": "Sam Patel", "text": "I think I'm good. The main challenge now is re-indexing the production data without downtime. Might need an extra pair of eyes for the migration script.", "start": 52, "end": 64},
            {"speaker": "Jordan Lee", "text": "I can take a look at the migration script after I finish the integration tests. Should be free by tomorrow afternoon.", "start": 65, "end": 74},
            {"speaker": "Sam Patel", "text": "That would be great Jordan, thanks.", "start": 75, "end": 79},
            {"speaker": "Alex Kim", "text": "Dana, anything we need to know about the CDN rollout before it goes to production?", "start": 80, "end": 88},
            {"speaker": "Dana Torres", "text": "Just need sign-off from the security team on the new cache headers. I've already sent them the config, waiting on their response.", "start": 89, "end": 100},
            {"speaker": "Alex Kim", "text": "I'll ping them to expedite. Let's wrap up. Great work everyone, see you tomorrow.", "start": 101, "end": 109},
        ],
        "summary": {
            "overview": "The engineering team held their weekly standup covering payment module testing, search indexing improvements, and CDN configuration deployment. Dana reported a 40% improvement in load times from the new CDN setup. Key blocker is security team sign-off on cache headers.",
            "key_topics": ["Payment module tests", "Search indexing", "CDN deployment", "Performance improvements"],
            "chapters": [
                {"title": "Individual Updates", "start_time_hint": 0},
                {"title": "Blockers & Support", "start_time_hint": 52},
                {"title": "CDN Production Readiness", "start_time_hint": 80},
            ],
        },
        "action_items": [
            {"text": "Complete integration tests for payment module", "assignee": "Jordan Lee", "due_date": "2025-04-17", "completed": True},
            {"text": "Review search indexing migration script", "assignee": "Jordan Lee", "due_date": "2025-04-18", "completed": False},
            {"text": "Get security team sign-off on CDN cache headers", "assignee": "Alex Kim", "due_date": "2025-04-17", "completed": False},
            {"text": "Deploy CDN configuration to production", "assignee": "Dana Torres", "due_date": "2025-04-19", "completed": False},
        ],
    },
    {
        "title": "Customer Success — Acme Corp Onboarding",
        "date": datetime.utcnow() - timedelta(days=7),
        "duration_seconds": 2700,
        "participants": [
            {"name": "Rachel Stone", "email": "rachel@company.com", "color": "#7c3aed"},
            {"name": "Tom Bradley", "email": "tom@acmecorp.com", "color": "#2563eb"},
            {"name": "Lisa Huang", "email": "lisa@acmecorp.com", "color": "#16a34a"},
        ],
        "transcript": [
            {"speaker": "Rachel Stone", "text": "Welcome Tom and Lisa! Excited to get Acme Corp fully set up on the platform today.", "start": 0, "end": 9},
            {"speaker": "Tom Bradley", "text": "Thanks Rachel. We've been looking forward to this. We have about 200 users we need to migrate over.", "start": 10, "end": 20},
            {"speaker": "Rachel Stone", "text": "Perfect. We'll handle that in phases. First, let me walk you through the admin dashboard.", "start": 21, "end": 29},
            {"speaker": "Lisa Huang", "text": "One thing we need upfront is SSO integration with our Okta instance. Is that supported?", "start": 30, "end": 39},
            {"speaker": "Rachel Stone", "text": "Absolutely, Okta is fully supported. I'll send you the SAML configuration guide after this call. It typically takes about an hour to set up.", "start": 40, "end": 52},
            {"speaker": "Tom Bradley", "text": "Great. We also need to know about your data retention policies. Our legal team has specific requirements.", "start": 53, "end": 63},
            {"speaker": "Rachel Stone", "text": "We retain data for 7 years by default, and you can configure custom retention periods per workspace. I'll share our data processing agreement as well.", "start": 64, "end": 77},
            {"speaker": "Lisa Huang", "text": "That should satisfy legal. What about API access? We want to integrate with our internal reporting tools.", "start": 78, "end": 88},
            {"speaker": "Rachel Stone", "text": "You'll have full API access on your enterprise plan. I'll generate your API credentials today and send them over securely.", "start": 89, "end": 100},
            {"speaker": "Tom Bradley", "text": "This all sounds good. When can we start the user migration?", "start": 101, "end": 108},
            {"speaker": "Rachel Stone", "text": "We can start the migration as soon as SSO is configured. I'd suggest doing a pilot with 10 users first, then rolling out to everyone else.", "start": 109, "end": 121},
            {"speaker": "Lisa Huang", "text": "That makes sense. We'll have our IT team set up SSO this week.", "start": 122, "end": 129},
            {"speaker": "Rachel Stone", "text": "Wonderful. I'll schedule a follow-up call for next week to check on the SSO setup and kick off the pilot migration.", "start": 130, "end": 140},
        ],
        "summary": {
            "overview": "Onboarding call with Acme Corp to set up their enterprise account. Key topics included SSO integration with Okta, data retention policies for legal compliance, and API access for internal tooling. A phased user migration plan was agreed upon, starting with a 10-user pilot.",
            "key_topics": ["SSO/Okta integration", "Data retention policy", "API access", "User migration plan", "Enterprise onboarding"],
            "chapters": [
                {"title": "Introduction & Overview", "start_time_hint": 0},
                {"title": "SSO & Security Requirements", "start_time_hint": 30},
                {"title": "Data & API Access", "start_time_hint": 53},
                {"title": "Migration Plan", "start_time_hint": 101},
            ],
        },
        "action_items": [
            {"text": "Send Okta SAML configuration guide to Acme Corp", "assignee": "Rachel Stone", "due_date": "2025-04-10", "completed": True},
            {"text": "Share data processing agreement with Acme Corp legal team", "assignee": "Rachel Stone", "due_date": "2025-04-10", "completed": True},
            {"text": "Generate and send API credentials to Lisa Huang", "assignee": "Rachel Stone", "due_date": "2025-04-10", "completed": True},
            {"text": "Configure Okta SSO integration", "assignee": "Lisa Huang", "due_date": "2025-04-17", "completed": False},
            {"text": "Schedule follow-up call for pilot migration kickoff", "assignee": "Rachel Stone", "due_date": "2025-04-17", "completed": False},
        ],
    },
    {
        "title": "Design Review — New Dashboard UI",
        "date": datetime.utcnow() - timedelta(days=14),
        "duration_seconds": 2100,
        "participants": [
            {"name": "Nina Patel", "email": "nina@company.com", "color": "#7c3aed"},
            {"name": "Chris Ward", "email": "chris@company.com", "color": "#2563eb"},
            {"name": "Emily Fox", "email": "emily@company.com", "color": "#16a34a"},
        ],
        "transcript": [
            {"speaker": "Nina Patel", "text": "Thanks for joining everyone. Today we're reviewing the new dashboard designs. Emily, want to share your screen?", "start": 0, "end": 10},
            {"speaker": "Emily Fox", "text": "Sure! So the main change is moving the navigation from the top to a left sidebar, which gives us much more vertical space for data.", "start": 11, "end": 23},
            {"speaker": "Chris Ward", "text": "I love the sidebar approach. It's consistent with what users expect from modern dashboards.", "start": 24, "end": 32},
            {"speaker": "Nina Patel", "text": "Agreed. What about the widget layout on the main view? The current mockup shows four columns which feels a bit cramped.", "start": 33, "end": 43},
            {"speaker": "Emily Fox", "text": "I have a three-column variant as well. Let me pull that up. This one uses more whitespace and should be easier to scan.", "start": 44, "end": 54},
            {"speaker": "Chris Ward", "text": "The three-column version is definitely cleaner. What do the charts look like on smaller screens?", "start": 55, "end": 64},
            {"speaker": "Emily Fox", "text": "The layout goes to two columns on tablet and single column on mobile. I've tested down to 375px width.", "start": 65, "end": 75},
            {"speaker": "Nina Patel", "text": "Perfect. What's the status on the dark mode variants?", "start": 76, "end": 82},
            {"speaker": "Emily Fox", "text": "Dark mode is about 70% done. The main challenge is getting the chart colors to work well on dark backgrounds while staying accessible.", "start": 83, "end": 95},
            {"speaker": "Chris Ward", "text": "For chart colors on dark backgrounds, check out the Material Design palette. They have a really good accessible set.", "start": 96, "end": 106},
            {"speaker": "Emily Fox", "text": "Oh that's a great idea, I'll look at those. I should be able to wrap up dark mode by end of week.", "start": 107, "end": 116},
            {"speaker": "Nina Patel", "text": "Great. Let's go with the three-column layout and the sidebar nav. Emily, can you update the Figma file and share the final specs with engineering?", "start": 117, "end": 129},
            {"speaker": "Emily Fox", "text": "Will do. I'll have everything updated by Thursday.", "start": 130, "end": 136},
        ],
        "summary": {
            "overview": "Design review for the new analytics dashboard UI. The team approved moving to a left sidebar navigation and a three-column widget layout for better readability. Dark mode design is 70% complete with accessibility work ongoing. Final specs will be delivered to engineering by Thursday.",
            "key_topics": ["Sidebar navigation", "Dashboard layout", "Responsive design", "Dark mode", "Accessibility"],
            "chapters": [
                {"title": "Navigation Design Review", "start_time_hint": 0},
                {"title": "Widget Layout Discussion", "start_time_hint": 33},
                {"title": "Dark Mode & Accessibility", "start_time_hint": 76},
                {"title": "Decision & Next Steps", "start_time_hint": 117},
            ],
        },
        "action_items": [
            {"text": "Update Figma file with three-column layout and sidebar nav", "assignee": "Emily Fox", "due_date": "2025-04-03", "completed": True},
            {"text": "Share final design specs with engineering team", "assignee": "Emily Fox", "due_date": "2025-04-03", "completed": True},
            {"text": "Complete dark mode color variants using Material Design palette", "assignee": "Emily Fox", "due_date": "2025-04-04", "completed": True},
        ],
    },
    {
        "title": "Incident Postmortem — API Outage April 5th",
        "date": datetime.utcnow() - timedelta(days=21),
        "duration_seconds": 3600,
        "participants": [
            {"name": "Dev Sharma", "email": "dev@company.com", "color": "#7c3aed"},
            {"name": "Kate Wilson", "email": "kate@company.com", "color": "#2563eb"},
            {"name": "Omar Hassan", "email": "omar@company.com", "color": "#16a34a"},
            {"name": "Jade Murphy", "email": "jade@company.com", "color": "#dc2626"},
        ],
        "transcript": [
            {"speaker": "Dev Sharma", "text": "Let's start the postmortem for the API outage on April 5th. The incident lasted 47 minutes and affected all API customers.", "start": 0, "end": 12},
            {"speaker": "Kate Wilson", "text": "I was on-call. The first alert came in at 14:23 UTC. Our API error rate jumped from 0.1% to 98% in about 30 seconds.", "start": 13, "end": 25},
            {"speaker": "Omar Hassan", "text": "I checked the deployment logs. We had deployed a new version of the rate limiter at 14:20 UTC. That's a three-minute gap.", "start": 26, "end": 37},
            {"speaker": "Kate Wilson", "text": "Exactly. The new rate limiter had a bug where it was treating all requests as unauthenticated and rejecting them.", "start": 38, "end": 48},
            {"speaker": "Jade Murphy", "text": "Why didn't our staging environment catch this? We have integration tests for the rate limiter.", "start": 49, "end": 58},
            {"speaker": "Omar Hassan", "text": "The staging environment doesn't replicate the production auth token format exactly. The bug was in parsing the Bearer token prefix.", "start": 59, "end": 70},
            {"speaker": "Dev Sharma", "text": "That's a critical gap. We need staging to mirror production auth exactly.", "start": 71, "end": 79},
            {"speaker": "Kate Wilson", "text": "Mitigation was a rollback. We identified the bad deploy at 14:35 and had it rolled back by 14:47. Twelve minutes from detection to resolution.", "start": 80, "end": 93},
            {"speaker": "Jade Murphy", "text": "We should have caught this faster. Our alert threshold was too high — 98% error rate before we got paged is unacceptable.", "start": 94, "end": 105},
            {"speaker": "Dev Sharma", "text": "Agreed. We're lowering the alert threshold to 5% error rate. And we're adding a canary deployment step before full rollout.", "start": 106, "end": 118},
            {"speaker": "Omar Hassan", "text": "I'll also fix the staging auth configuration to match production. Should take about half a day.", "start": 119, "end": 128},
            {"speaker": "Kate Wilson", "text": "We also owe customers a status page update. We were slow to post there during the incident.", "start": 129, "end": 138},
            {"speaker": "Jade Murphy", "text": "I'll draft a customer communication template for future incidents. Having it ready in advance will save time.", "start": 139, "end": 149},
            {"speaker": "Dev Sharma", "text": "Good. Let's document all of this in Confluence and track the remediation items. We'll do a 30-day follow-up to verify everything is done.", "start": 150, "end": 162},
        ],
        "summary": {
            "overview": "Postmortem for the 47-minute API outage on April 5th caused by a bug in the new rate limiter deployment. The rate limiter incorrectly rejected all requests as unauthenticated due to a Bearer token parsing bug not caught by staging. Remediation includes lower alert thresholds, canary deployments, staging environment parity fixes, and improved incident communication.",
            "key_topics": ["API outage root cause", "Rate limiter bug", "Staging environment gaps", "Alert thresholds", "Canary deployments", "Incident communication"],
            "chapters": [
                {"title": "Incident Timeline", "start_time_hint": 0},
                {"title": "Root Cause Analysis", "start_time_hint": 38},
                {"title": "Detection & Mitigation", "start_time_hint": 80},
                {"title": "Remediation Actions", "start_time_hint": 106},
            ],
        },
        "action_items": [
            {"text": "Lower API error rate alert threshold to 5%", "assignee": "Dev Sharma", "due_date": "2025-03-28", "completed": True},
            {"text": "Implement canary deployment step for rate limiter changes", "assignee": "Omar Hassan", "due_date": "2025-04-05", "completed": False},
            {"text": "Fix staging auth configuration to match production Bearer token format", "assignee": "Omar Hassan", "due_date": "2025-03-29", "completed": True},
            {"text": "Draft customer incident communication template", "assignee": "Jade Murphy", "due_date": "2025-03-28", "completed": True},
            {"text": "Document postmortem findings in Confluence", "assignee": "Dev Sharma", "due_date": "2025-03-29", "completed": True},
            {"text": "Schedule 30-day remediation follow-up", "assignee": "Dev Sharma", "due_date": "2025-04-28", "completed": False},
        ],
    },
]


async def seed_database(db):
    from sqlalchemy import select
    result = await db.execute(select(Meeting))
    if result.scalars().first():
        return  # already seeded

    for data in MEETINGS_DATA:
        meeting = Meeting(
            title=data["title"],
            date=data["date"],
            duration_seconds=data["duration_seconds"],
        )
        db.add(meeting)
        await db.flush()

        for p in data["participants"]:
            db.add(Participant(
                meeting_id=meeting.id,
                name=p["name"],
                email=p["email"],
                color_hex=p["color"],
            ))

        for i, seg in enumerate(data["transcript"]):
            db.add(TranscriptSegment(
                meeting_id=meeting.id,
                speaker_name=seg["speaker"],
                text=seg["text"],
                start_time_seconds=seg["start"],
                end_time_seconds=seg["end"],
                sequence_order=i,
            ))

        s = data["summary"]
        db.add(Summary(
            meeting_id=meeting.id,
            overview=s["overview"],
            key_topics=s["key_topics"],
            chapters=s["chapters"],
        ))

        for item in data["action_items"]:
            db.add(ActionItem(
                meeting_id=meeting.id,
                text=item["text"],
                assignee=item["assignee"],
                due_date=item["due_date"],
                is_completed=item["completed"],
            ))

    await db.commit()
    print("Database seeded successfully.")
