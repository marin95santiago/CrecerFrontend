interface Response {
  code: string;
  description: string;
}

export function listObject(object: any): Response[] {
  const res: Response[] = [];

  for (const code in object) {
    if (object.hasOwnProperty(code)) {
      const description = object[code];
      res.push({ code, description });
    }
  }

  return res;
}
