# Corey Stephens


# 1
select LastName, FirstName
  from nwEmployees
  where not country = 'USA'
  and Extract(year from now()) - Extract(year from HireDate) > 5
  order by LastName;

# 2
select ProductID, ProductName, UnitsInStock, UnitPrice
  from nwProducts
  where UnitsInStock <= ReorderLevel;

# 3
select ProductName, UnitPrice from nwProducts
  where UnitPrice = (
    select max(UnitPrice)
    from nwProducts);

# 4
select ProductID, ProductName, (UnitPrice * UnitsInStock) as TotalInventoryValue 
  from nwProducts
  where UnitPrice * UnitsInStock > 2000
  order by TotalInventoryValue;

# 5
select ShipCountry, count(*) as ShippedOrders
  from nwOrders
  where not Shipcountry = 'USA'
  and extract(year from ShippedDate) = 2013
  and extract(month from ShippedDate) = 9
  group by ShipCountry;

# 6
select CustomerID, CompanyName
  from nwCustomers C
  where (
    select count(*) as Orders
      from nwOrders
      where C.CustomerID = CustomerID
      group by CustomerID);

# 7
select SupplierID, InventoryValue
  from (
    select SupplierID, sum(UnitsInStock * UnitPrice) as InventoryValue, count(ProductID) as NumProducts
    from nwProducts
    group by SupplierID
    ) as t
  where NumProducts > 3;

# 8
select CompanyName, ProductName, UnitPrice
  from nwProducts
  join nwSuppliers on nwProducts.SupplierID = nwSuppliers.SupplierID
  where Country='USA'
  order by UnitPrice desc;

# 9
select LastName, FirstName, Title, Extension
  from nwEmployees E
  where (
    select count(*)
    from nwOrders
    where E.EmployeeID = EmployeeID
    group by EmployeeID
  ) > 100;

# 10
select CustomerID, CompanyName
  from nwCustomers
  where CustomerID not in (
    select CustomerID from nwOrders);

# 11
select S.CompanyName, S.ContactName, C.CategoryName, C.Description, P.ProductName, P.UnitsOnOrder
  from nwSuppliers S
  join nwProducts P on S.SupplierID
  join nwCategories C on P.CategoryID = C.CategoryID
  where P.UnitsInStock = 0;

# 12
select P.ProductName, s.CompanyName, S.Country, P.UnitsInStock
  from nwProducts P
  join nwSuppliers S on P.SupplierID = S.SupplierID
  join nwCategories C on P.CategoryID = P.CategoryID
  where P.CategoryID = 1;

# 13
create table Top_Items (
  ItemID INT PRIMARY KEY,
  ItemCode INT,
  ItemName VARCHAR(40),
  InventoryDate DATE,
  SupplierID INT,
  ItemQuantity INT,
  ItemPrice DECIMAL(9,2));

# 14
insert into Top_Items
  (ItemID, Itemcode, ItemName, InventoryDate, ItemQuantity, ItemPrice, SupplierID)
  select ProductID, CategoryID, ProductName, curdate(), UnitsInStock, UnitPrice, SupplierID
  from nwProducts
  where UnitPrice * UnitsInStock > 2500;

# 15
delete from Top_Items
  where SupplierID in (
    select SupplierID
    from nwSuppliers
    where Country='Canada');

# 16
alter table Top_Items
  add InventoryValue decimal(9,2);

# 17
update Top_Items
  set InventoryValue = ItemPrice * ItemQuantity;

# 18
drop table Top_Items;
