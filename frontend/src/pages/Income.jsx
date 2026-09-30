import ResourcePage from "./ResourcePage";

export default function Income() {
  return (
    <ResourcePage
      resource="income"
      title="Income"
      subtitle="Track money coming in and recurring income."
      fields={["amount", "source", "date", "description"]}
    />
  );
}
