import { Rect } from '../../util';

describe('Rect', () => {
   test(`calculates width and height correctly.`, () => {
       const rect = [10, 10, 90, 70] as Rect;
       expect(Rect.width(rect)).toBe(80);
       expect(Rect.height(rect)).toBe(60);
   });

   test(`calculates area correctly.`, () => {
      const rect = [0, 10, 30, 80] as Rect;
      expect(Rect.area(rect)).toBe(2100);
   });

   test(`can be checked for degeneracy.`, () => {
       expect(Rect.isDegenerate([0, 0, 0, 0])).toBe(true);
       expect(Rect.isDegenerate([0, 10, 0, 10])).toBe(true);
       expect(Rect.isDegenerate([-10, 0, -10, 0])).toBe(true);
       expect(Rect.isDegenerate([0, 0, 10, 10])).toBe(false);
   });

   test('can have a difference Region calculated w.r.t. another Rect.', () => {
       // No intersection at all.
       {
           const rect1 = [0, 0, 10, 10] as Rect;
           const rect2 = [10, 10, 20, 20] as Rect;

           expect(Rect.difference(rect1, rect2)).toEqual(
               new Set([rect1, rect2])
           );
       }

       // Complete intersection.
       {
           const rect1 = [0, 0, 10, 10] as Rect;
           const rect2 = [0, 0, 10, 10] as Rect;

           expect(Rect.difference(rect1, rect2)).toEqual(new Set());
       }

       // Partial X intersection.
       {
           const rect1 = [0, 0, 10, 10] as Rect;
           const rect2 = [5, 0, 15, 10] as Rect;

           expect(Rect.difference(rect1, rect2)).toEqual(new Set<Rect>([
              [0, 0, 5, 10],
              [10, 0, 15, 10]
           ]));
       }

       // Partial Y intersection.
       {
           const rect1 = [0, 0, 10, 10] as Rect;
           const rect2 = [0, 5, 10, 15] as Rect;

           expect(Rect.difference(rect1, rect2)).toEqual(new Set<Rect>([
               [0, 0, 10, 5],
               [0, 10, 10, 15]
           ]));
       }

       // TL/BR diagonal intersection.
       {
           const rect1 = [0, 0, 10, 10] as Rect;
           const rect2 = [5, 5, 15, 15] as Rect;

           expect(Rect.difference(rect1, rect2)).toEqual(new Set<Rect>([
               [0, 0, 5, 5],
               [5, 0, 10, 5],
               [0, 5, 5, 10],
               [10, 5, 15, 10],
               [5, 10, 10, 15],
               [10, 10, 15, 15]
           ]));
       }

       // TR/BL diagonal intersection.
       {
           const rect1 = [5, 0, 15, 10] as Rect;
           const rect2 = [0, 5, 10, 15] as Rect;

           expect(Rect.difference(rect1, rect2)).toEqual(new Set<Rect>([
               [5, 0, 10, 5],
               [10, 0, 15, 5],
               [0, 5, 5, 10],
               [10, 5, 15, 10],
               [0, 10, 5, 15],
               [5, 10, 10, 15]
           ]));
       }
   });
});
