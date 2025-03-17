const TITLE_TEMPLATE = "%s | Carlo's Tools";

export default function getTitle(title: string = "Home") {
  return TITLE_TEMPLATE.replace("%s", title);
}
