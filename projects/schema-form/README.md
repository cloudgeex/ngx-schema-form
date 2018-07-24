New features:
- Ajv schema validator.
- Angular forms compatible: Property tree is created using FormGroup, FormArray and FormControl classes.
- Array now properly loads initial data from model.
- WidgetTyep: WidgetRegistry now supports WidgetType, now working WidgetType.Field and WidgetType.Fieldset.
- Fieldset widgets: Now we create widgets for the fieldset. Rightn now only Fieldset (default) and Tabs are available.
- No widget: If widget id is set to 'none', control will be generated but no widget will be created.
- FormProperty now has access to widget instance, ObjectProperty also has access to fieldset widget instance.


TODO:
- fix 2 way data binding not working when model is updated programatically.
- for schema changes (template schema ngIf), use json-patch to update controls tree without rebuilding.
- tests, lots of them.
- add animation for control tree update
- expose widget from template schema fields, fieldsets and buttons

