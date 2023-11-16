
view 1;
```
CREATE VIEW robust_card_registry AS
SELECT DISTINCT 
    cr.*,  -- Select all columns from card_registry
    ect.card_name,  -- Columns from ENUM_card_type
    est.symbol_name  -- Columns from ENUM_symbol_type
FROM 
    card_registry cr 
INNER JOIN 
    ENUM_card_type ect 
ON 
    cr.card_type = ect.card_type
INNER JOIN
    ENUM_symbol_type est 
ON
    cr.symbol_type = est.symbol_type;
```