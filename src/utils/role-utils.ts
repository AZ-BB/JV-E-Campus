export function getRoleColor(roleName: string) {
  switch (roleName) {
    case "BOH":
      return "#22c55e"
    case "FOH":
      return "#8b5cf6"
    case "MANAGER":
      return "#f59e0b"
    case "Barista":
      return "#ec4899"
    default:
      return "#8b5cf6"
  }
}

export function getRoleColorLight(roleName: string) {
  switch (roleName) {
    case "BOH":
      return "#86efac"
    case "FOH":
      return "#c4b5fd"
    case "MANAGER":
      return "#fbbf24"
    case "Barista":
      return "#f472b6"
    default:
      return "#c4b5fd"
  }
}

export function getRoleIcon(roleName: string) {
  switch (roleName) {
    case "BOH":
      return "ri-restaurant-line"
    case "FOH":
      return "ri-team-line"
    case "MANAGER":
      return "ri-bar-chart-line"
    case "Barista":
      return "ri-drop-line"
    default:
      return "ri-team-line"
  }
}

export function getRoleDescription(roleName: string) {
  switch (roleName) {
    case "BOH":
      return "Learn the fundamentals of food preparation and equipment operation"
    case "FOH":
      return "Learn customer service, front desk operations, and guest relations"
    case "MANAGER":
      return "Master leadership skills, business operations, and team development strategies"
    case "Barista":
      return "Learn the fundamentals of bar operations, inventory management, and staff training"
    default:
      return "Master shift coordination, team management, and operational oversight"
  }
}