import ResourcePage from "./ResourcePage";

export default function MySpace() {
  return (
    <ResourcePage
      resource="notes"
      title="My Space"
      subtitle="A calm corner for finance notes, plans, and reminders."
      fields={["title", "content", "category", "priority"]}
    />
  );
}
