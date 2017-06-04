all:
	zip -r Alfred-Workflow-Zoom.us-by-ChaiFeng.alfredworkflow * -x \*.alfredworkflow

clean:
	rm -f *.alfredworkflow
