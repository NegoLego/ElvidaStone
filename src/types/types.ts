export interface Category {
  category_name: string,
  items: {
    title: string,
    versions: {
      title: string,
      images: string[]
    }[]
  }[]
}
