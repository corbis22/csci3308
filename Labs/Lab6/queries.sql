/* 1 */
select *
  from store
  order by sname;

/* 2 */
select *
  from store
  order by sname
  limit 3;

/* 3 */
select * from(
  select *
    from store
    order by sname desc
    limit 3) sub
  order by sname asc;

/* 4 */
select *
  from store
  where price > 1;

/* 5 */
select *, (qty * price) as extprice
  from store;

/* 6 */
select sum(extprice) as 'Total Price' from (
  select *, (qty * price) as extprice
  from store) sub;

/* 7 */
select count(sname) as 'Total Items' from store;

/* 8 */
select *
  from course
  where department_id=1;

/* 9 */
select sum(count) as 'Total Enrollment'
  from enrollment;

/* 10 */
select count(id) as 'Total Courses'
  from course;

/* 11 */
select count(id) as 'Total Departments'
  from department;

/* 12 */
select concat(name, cname) as 'Course Name'
  from course
  join department on course.department_id = department.id
  where department_id = 1;

/* 13 */
select concat(name, cname) as 'Course Name'
  from course
  join department on course.department_id = department.id;

/* 14 */
select cname as 'Course', name as 'Department', count as 'Enrollment'
  from course
  join department on course.department_id = department.id
  join enrollment on course.id = enrollment.id;
